"use client";

import * as Tone from "tone";
import { createDrumKit, type DrumKit, type DrumVoice } from "./drum-kit";
import { TechnoSynth, type SynthState } from "./synth";
import {
  emptyPattern,
  type Pattern,
  VOICES,
} from "./sequencer";

// ===== Scale helpers =====
//
// Notes are stored as scale degrees (1..7) per step. The engine converts to
// real note names based on the chosen key + octave per track.

const NOTE_ORDER = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;
type NoteName = typeof NOTE_ORDER[number];

const SCALES: Record<string, number[]> = {
  // semitone offsets from the tonic for each scale degree (1..7)
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
};

export type ScaleName = keyof typeof SCALES;

function noteForDegree(
  tonic: NoteName,
  scale: ScaleName,
  octave: number,
  degree: number, // 1..7
): string {
  const tonicIdx = NOTE_ORDER.indexOf(tonic);
  const offsets = SCALES[scale];
  const semis = offsets[(degree - 1) % offsets.length];
  const targetIdx = (tonicIdx + semis) % 12;
  const targetOct = octave + Math.floor((tonicIdx + semis) / 12);
  return `${NOTE_ORDER[targetIdx]}${targetOct}`;
}

export type MelodyStep = number | null; // 1..7 = scale degree, null = rest
export type Melody = MelodyStep[]; // length 16

export const STEPS = 16;
export const KEYS: NoteName[] = ["C", "D", "E", "F", "G", "A"];

export interface StudioState {
  bpm: number;
  key: NoteName;
  scale: ScaleName;
  drum: Pattern;
  bass: Melody;
  lead: Melody;
  bassOctave: number;
  leadOctave: number;
  bassMute: boolean;
  leadMute: boolean;
  drumMute: boolean;
}

export function emptyMelody(): Melody {
  return Array(STEPS).fill(null);
}

// Default presets baked into each track so the user gets a usable sound
// without touching the synth panel.
const BASS_PRESET: Partial<SynthState> = {
  osc1Type: "sawtooth",
  osc2Type: "sawtooth",
  osc2Detune: 11,
  osc2Mix: 0.6,
  subLevel: 0.6,
  filterCutoff: 600,
  filterRes: 3,
  ampAttack: 0.002,
  ampDecay: 0.4,
  ampSustain: 0.0,
  ampRelease: 0.15,
  filterEnvAmount: 0.65,
  filterDecay: 0.18,
  filterSustain: 0,
  drive: 0.25,
  reverbMix: 0.05,
  delayMix: 0,
  volume: -8,
};

const LEAD_PRESET: Partial<SynthState> = {
  osc1Type: "square",
  osc2Type: "triangle",
  osc2Detune: 700,
  osc2Mix: 0.4,
  subLevel: 0,
  filterCutoff: 3200,
  filterRes: 1.5,
  ampAttack: 0.003,
  ampDecay: 0.25,
  ampSustain: 0,
  ampRelease: 0.25,
  filterEnvAmount: 0.4,
  filterDecay: 0.2,
  filterSustain: 0,
  delayMix: 0.45,
  delayTime: 0.375,
  reverbMix: 0.5,
  drive: 0.05,
  volume: -12,
};

export class StudioEngine {
  private kit: DrumKit;
  private bassSynth: TechnoSynth;
  private leadSynth: TechnoSynth;
  private state: StudioState;

  private drumSeq: Tone.Sequence<number> | null = null;
  private bassSeq: Tone.Sequence<number> | null = null;
  private leadSeq: Tone.Sequence<number> | null = null;

  private stepListener: ((step: number) => void) | null = null;

  constructor(initial?: Partial<StudioState>) {
    this.kit = createDrumKit();
    this.bassSynth = new TechnoSynth();
    this.bassSynth.set(BASS_PRESET);
    this.leadSynth = new TechnoSynth();
    this.leadSynth.set(LEAD_PRESET);

    this.state = {
      bpm: 124,
      key: "A",
      scale: "minor",
      drum: emptyPattern(),
      bass: emptyMelody(),
      lead: emptyMelody(),
      bassOctave: 2,
      leadOctave: 4,
      bassMute: false,
      leadMute: false,
      drumMute: false,
      ...initial,
    };
  }

  getState(): StudioState {
    return { ...this.state };
  }

  setBpm(bpm: number) {
    this.state.bpm = bpm;
    Tone.getTransport().bpm.rampTo(bpm, 0.05);
  }

  setKey(key: NoteName) {
    this.state.key = key;
  }

  setScale(scale: ScaleName) {
    this.state.scale = scale;
  }

  setDrumPattern(p: Pattern) {
    this.state.drum = p;
  }

  setBassMelody(m: Melody) {
    this.state.bass = m;
  }

  setLeadMelody(m: Melody) {
    this.state.lead = m;
  }

  setBassOctave(o: number) {
    this.state.bassOctave = Math.max(1, Math.min(5, o));
  }

  setLeadOctave(o: number) {
    this.state.leadOctave = Math.max(1, Math.min(6, o));
  }

  setMute(track: "drum" | "bass" | "lead", muted: boolean) {
    if (track === "drum") this.state.drumMute = muted;
    if (track === "bass") this.state.bassMute = muted;
    if (track === "lead") this.state.leadMute = muted;
  }

  onStep(cb: (step: number) => void) {
    this.stepListener = cb;
  }

  start() {
    if (!this.drumSeq) {
      this.drumSeq = new Tone.Sequence<number>(
        (time, step) => {
          if (this.state.drumMute) return;
          for (const v of VOICES) {
            if (this.state.drum[v][step]) {
              this.kit.trigger(v as DrumVoice, time);
            }
          }
          Tone.getDraw().schedule(() => {
            this.stepListener?.(step);
          }, time);
        },
        Array.from({ length: STEPS }, (_, i) => i),
        "16n",
      );
      this.drumSeq.start(0);
    }

    if (!this.bassSeq) {
      this.bassSeq = new Tone.Sequence<number>(
        (time, step) => {
          if (this.state.bassMute) return;
          const degree = this.state.bass[step];
          if (!degree) return;
          const note = noteForDegree(
            this.state.key,
            this.state.scale,
            this.state.bassOctave,
            degree,
          );
          const dur = Tone.Time("16n").toSeconds() * 0.85;
          this.bassSynth.noteOn(note, 0.85, time);
          this.bassSynth.noteOff(note, time + dur);
        },
        Array.from({ length: STEPS }, (_, i) => i),
        "16n",
      );
      this.bassSeq.start(0);
    }

    if (!this.leadSeq) {
      this.leadSeq = new Tone.Sequence<number>(
        (time, step) => {
          if (this.state.leadMute) return;
          const degree = this.state.lead[step];
          if (!degree) return;
          const note = noteForDegree(
            this.state.key,
            this.state.scale,
            this.state.leadOctave,
            degree,
          );
          const dur = Tone.Time("8n").toSeconds() * 0.85;
          this.leadSynth.noteOn(note, 0.7, time);
          this.leadSynth.noteOff(note, time + dur);
        },
        Array.from({ length: STEPS }, (_, i) => i),
        "16n",
      );
      this.leadSeq.start(0);
    }

    Tone.getTransport().start();
  }

  stop() {
    Tone.getTransport().stop();
    Tone.getTransport().position = 0;
    this.bassSynth.releaseAll();
    this.leadSynth.releaseAll();
    this.stepListener?.(-1);
  }

  isPlaying() {
    return Tone.getTransport().state === "started";
  }

  /**
   * Render the current track to a WAV blob using OfflineAudioContext-style
   * approach. For simplicity we render exactly 4 bars (16 beats × 4 / BPM).
   */
  async renderToWav(bars = 4): Promise<Blob> {
    const seconds = (bars * 4 * 60) / this.state.bpm + 0.5; // tail
    const buffer = await Tone.Offline(({ transport }) => {
      const kit = createDrumKit();
      const bass = new TechnoSynth();
      bass.set(BASS_PRESET);
      const lead = new TechnoSynth();
      lead.set(LEAD_PRESET);

      transport.bpm.value = this.state.bpm;

      new Tone.Sequence(
        (time, step) => {
          if (this.state.drumMute) return;
          for (const v of VOICES) {
            if (this.state.drum[v][step]) {
              kit.trigger(v as DrumVoice, time);
            }
          }
        },
        Array.from({ length: STEPS }, (_, i) => i),
        "16n",
      ).start(0);

      new Tone.Sequence(
        (time, step) => {
          if (this.state.bassMute) return;
          const degree = this.state.bass[step];
          if (!degree) return;
          const note = noteForDegree(
            this.state.key,
            this.state.scale,
            this.state.bassOctave,
            degree,
          );
          bass.noteOn(note, 0.85, time);
          bass.noteOff(note, time + Tone.Time("16n").toSeconds() * 0.85);
        },
        Array.from({ length: STEPS }, (_, i) => i),
        "16n",
      ).start(0);

      new Tone.Sequence(
        (time, step) => {
          if (this.state.leadMute) return;
          const degree = this.state.lead[step];
          if (!degree) return;
          const note = noteForDegree(
            this.state.key,
            this.state.scale,
            this.state.leadOctave,
            degree,
          );
          lead.noteOn(note, 0.7, time);
          lead.noteOff(note, time + Tone.Time("8n").toSeconds() * 0.85);
        },
        Array.from({ length: STEPS }, (_, i) => i),
        "16n",
      ).start(0);

      transport.start();
    }, seconds);

    return audioBufferToWav(buffer.get() as AudioBuffer);
  }

  dispose() {
    this.stop();
    this.drumSeq?.dispose();
    this.bassSeq?.dispose();
    this.leadSeq?.dispose();
    this.kit.dispose();
    this.bassSynth.dispose();
    this.leadSynth.dispose();
  }
}

// Convert an AudioBuffer to a 16-bit PCM WAV Blob.
function audioBufferToWav(buf: AudioBuffer): Blob {
  const numChannels = buf.numberOfChannels;
  const sampleRate = buf.sampleRate;
  const length = buf.length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = length * blockAlign;
  const totalSize = 44 + dataSize;
  const arrayBuf = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuf);

  function writeStr(offset: number, s: string) {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  }

  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) channels.push(buf.getChannelData(c));
  for (let i = 0; i < length; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channels[c][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }
  return new Blob([arrayBuf], { type: "audio/wav" });
}
