"use client";

import * as Tone from "tone";
import { createDrumKit, type DrumKit, type DrumVoice } from "./drum-kit";
import type { TechnoSynth } from "./synth";

/**
 * Self-contained "play with groove" engine for the Sound Design Lab.
 *
 * Plays a four-on-the-floor kick + backbeat clap + off-beat hats while the
 * user's TechnoSynth runs an 8-note minor arpeggio over it, all driven from
 * Tone.Transport so the timing stays glued to the BPM.
 */
// In Tone.Sequence the value type is whatever you pass — null is treated as a
// rest. We use a tagged "rest" string instead so the generic param stays clean.
type DrumStep = DrumVoice | "_";
type ArpStep = string; // a note name OR "_" for rest

export class SynthJam {
  private drum: DrumKit;
  private drumSeq: Tone.Sequence<DrumStep> | null = null;
  private clapSeq: Tone.Sequence<DrumStep> | null = null;
  private arpSeq: Tone.Sequence<ArpStep> | null = null;
  private synth: TechnoSynth;
  private noteDur: string = "8n";

  constructor(synth: TechnoSynth) {
    this.synth = synth;
    this.drum = createDrumKit();
    this.drum.setVolume(-3);
  }

  setBpm(bpm: number) {
    Tone.getTransport().bpm.rampTo(bpm, 0.05);
  }

  setArpeggio(notes: string[]) {
    this.arpSeq?.dispose();
    const safeNotes: ArpStep[] = notes.map((n) => n ?? "_");
    const seq = new Tone.Sequence<ArpStep>(
      (time, note) => {
        if (!note || note === "_") return;
        const dur = Tone.Time(this.noteDur).toSeconds() * 0.85;
        this.synth.noteOn(note, 0.8, time);
        this.synth.noteOff(note, time + dur);
      },
      safeNotes,
      this.noteDur,
    );
    seq.start(0);
    this.arpSeq = seq;
  }

  start() {
    if (!this.drumSeq) {
      this.drumSeq = new Tone.Sequence<DrumStep>(
        (time, voice) => {
          if (voice !== "_") this.drum.trigger(voice, time);
        },
        // 16 steps in a bar
        [
          "kick", "_", "hat", "_",
          "kick", "_", "hat", "_",
          "kick", "_", "hat", "_",
          "kick", "_", "hat", "_",
        ],
        "16n",
      );
      this.drumSeq.start(0);

      this.clapSeq = new Tone.Sequence<DrumStep>(
        (time, voice) => {
          if (voice !== "_") this.drum.trigger(voice, time);
        },
        [
          "_", "_", "_", "_",
          "clap", "_", "_", "_",
          "_", "_", "_", "_",
          "clap", "_", "_", "_",
        ],
        "16n",
      );
      this.clapSeq.start(0);
    }
    Tone.getTransport().start();
  }

  stop() {
    Tone.getTransport().stop();
    Tone.getTransport().position = 0;
    this.synth.releaseAll();
  }

  isRunning() {
    return Tone.getTransport().state === "started";
  }

  dispose() {
    this.stop();
    this.drumSeq?.dispose();
    this.clapSeq?.dispose();
    this.arpSeq?.dispose();
    this.drum.dispose();
  }
}

// Common minor-key arpeggios for melodic techno. Use "_" for a rest.
export const ARP_PATTERNS: { id: string; label: string; notes: string[] }[] = [
  {
    id: "cm-up-down",
    label: "Cm — sube y baja",
    notes: ["C3", "Eb3", "G3", "C4", "Eb4", "C4", "G3", "Eb3"],
  },
  {
    id: "cm-octaves",
    label: "Cm — saltos de octava",
    notes: ["C3", "G3", "C4", "Eb4", "C4", "G3", "C3", "Eb3"],
  },
  {
    id: "am-melodic",
    label: "Am — melódico",
    notes: ["A2", "C3", "E3", "A3", "G3", "E3", "C3", "A2"],
  },
  {
    id: "fm-stab",
    label: "Fm — stab",
    notes: ["F3", "_", "Ab3", "_", "C4", "_", "F3", "_"],
  },
];
