"use client";

import * as Tone from "tone";

export type OscType = "sawtooth" | "square" | "sine" | "triangle";
export type FilterType = "lowpass" | "highpass" | "bandpass";
export type LfoTarget = "off" | "filter" | "pitch" | "amp";

export interface SynthState {
  osc1Type: OscType;
  osc2Type: OscType;
  osc2Detune: number; // cents
  osc2Mix: number; // 0..1
  subLevel: number; // 0..1
  filterType: FilterType;
  filterCutoff: number; // Hz
  filterRes: number; // 0..20 ish
  ampAttack: number;
  ampDecay: number;
  ampSustain: number;
  ampRelease: number;
  filterEnvAmount: number; // 0..1, how much env opens the filter
  filterAttack: number;
  filterDecay: number;
  filterSustain: number;
  filterRelease: number;
  lfoRate: number;
  lfoDepth: number;
  lfoTarget: LfoTarget;
  delayMix: number;
  delayTime: number;
  reverbMix: number;
  drive: number;
  volume: number; // dB
}

export const DEFAULT_SYNTH: SynthState = {
  osc1Type: "sawtooth",
  osc2Type: "sawtooth",
  osc2Detune: 7,
  osc2Mix: 0.5,
  subLevel: 0.4,
  filterType: "lowpass",
  filterCutoff: 1200,
  filterRes: 4,
  ampAttack: 0.005,
  ampDecay: 0.2,
  ampSustain: 0.7,
  ampRelease: 0.4,
  filterEnvAmount: 0.5,
  filterAttack: 0.01,
  filterDecay: 0.4,
  filterSustain: 0.2,
  filterRelease: 0.4,
  lfoRate: 4,
  lfoDepth: 0,
  lfoTarget: "off",
  delayMix: 0.15,
  delayTime: 0.375,
  reverbMix: 0.2,
  drive: 0.1,
  volume: -10,
};

/**
 * A small subtractive synth voice with two oscillators, sub, filter env, amp env,
 * LFO and an FX bus (drive → delay → reverb). Built around Tone.PolySynth so it
 * can hold chords for melodic techno work.
 */
export class TechnoSynth {
  private out: Tone.Gain;
  private drive: Tone.Distortion;
  private delay: Tone.FeedbackDelay;
  private reverb: Tone.Reverb;
  private filter: Tone.Filter;
  private filterEnv: Tone.FrequencyEnvelope;
  private lfo: Tone.LFO;
  private osc1: Tone.PolySynth<Tone.MonoSynth>;
  private osc2: Tone.PolySynth<Tone.MonoSynth>;
  private sub: Tone.PolySynth<Tone.MonoSynth>;
  private osc2Gain: Tone.Gain;
  private subGain: Tone.Gain;
  private state: SynthState = { ...DEFAULT_SYNTH };

  constructor() {
    this.out = new Tone.Gain(Tone.dbToGain(this.state.volume)).toDestination();
    this.reverb = new Tone.Reverb({ decay: 3.5, wet: this.state.reverbMix }).connect(this.out);
    this.delay = new Tone.FeedbackDelay({
      delayTime: this.state.delayTime,
      feedback: 0.35,
      wet: this.state.delayMix,
    }).connect(this.reverb);
    this.drive = new Tone.Distortion({ distortion: this.state.drive, wet: 1 }).connect(this.delay);
    this.filter = new Tone.Filter({
      frequency: this.state.filterCutoff,
      type: this.state.filterType,
      Q: this.state.filterRes,
      rolloff: -24,
    }).connect(this.drive);
    this.filterEnv = new Tone.FrequencyEnvelope({
      attack: this.state.filterAttack,
      decay: this.state.filterDecay,
      sustain: this.state.filterSustain,
      release: this.state.filterRelease,
      baseFrequency: this.state.filterCutoff,
      octaves: this.state.filterEnvAmount * 4,
    }).connect(this.filter.frequency);

    // PolySynth + MonoSynth options are deeply nested and require all sub-fields
    // when typed strictly; we treat them as opaque records since Tone.js accepts
    // the partial shape at runtime.
    const ampOpts = {
      oscillator: { type: this.state.osc1Type },
      envelope: {
        attack: this.state.ampAttack,
        decay: this.state.ampDecay,
        sustain: this.state.ampSustain,
        release: this.state.ampRelease,
      },
      filter: { type: "lowpass", Q: 0, rolloff: -12 },
      filterEnvelope: {
        attack: 0,
        decay: 0,
        sustain: 1,
        release: 0,
        baseFrequency: 20000,
        octaves: 0,
      },
    } as unknown as ConstructorParameters<typeof Tone.MonoSynth>[0];

    this.osc1 = new Tone.PolySynth(Tone.MonoSynth, ampOpts).connect(this.filter);
    this.osc2 = new Tone.PolySynth(Tone.MonoSynth, {
      ...ampOpts,
      oscillator: {
        type: this.state.osc2Type,
        detune: this.state.osc2Detune,
      },
    } as unknown as ConstructorParameters<typeof Tone.MonoSynth>[0]);
    this.osc2Gain = new Tone.Gain(this.state.osc2Mix).connect(this.filter);
    this.osc2.connect(this.osc2Gain);

    this.sub = new Tone.PolySynth(Tone.MonoSynth, {
      ...ampOpts,
      oscillator: { type: "sine" },
    } as unknown as ConstructorParameters<typeof Tone.MonoSynth>[0]);
    this.subGain = new Tone.Gain(this.state.subLevel).connect(this.filter);
    this.sub.connect(this.subGain);

    this.lfo = new Tone.LFO({
      frequency: this.state.lfoRate,
      min: 0,
      max: 0,
    });
    this.lfo.start();
  }

  set(state: Partial<SynthState>) {
    Object.assign(this.state, state);
    const s = this.state;

    if (state.osc1Type !== undefined) {
      this.osc1.set({
        oscillator: { type: s.osc1Type },
      } as unknown as Parameters<typeof this.osc1.set>[0]);
    }
    if (state.osc2Type !== undefined || state.osc2Detune !== undefined) {
      this.osc2.set({
        oscillator: {
          type: s.osc2Type,
          detune: s.osc2Detune,
        },
      } as unknown as Parameters<typeof this.osc2.set>[0]);
    }
    if (state.osc2Mix !== undefined) {
      this.osc2Gain.gain.rampTo(s.osc2Mix, 0.02);
    }
    if (state.subLevel !== undefined) {
      this.subGain.gain.rampTo(s.subLevel, 0.02);
    }
    if (state.filterType !== undefined) {
      this.filter.type = s.filterType;
    }
    if (state.filterCutoff !== undefined) {
      this.filter.frequency.rampTo(s.filterCutoff, 0.02);
      this.filterEnv.baseFrequency = s.filterCutoff;
    }
    if (state.filterRes !== undefined) {
      this.filter.Q.rampTo(s.filterRes, 0.02);
    }
    if (state.filterEnvAmount !== undefined) {
      this.filterEnv.octaves = s.filterEnvAmount * 4;
    }
    if (
      state.filterAttack !== undefined ||
      state.filterDecay !== undefined ||
      state.filterSustain !== undefined ||
      state.filterRelease !== undefined
    ) {
      this.filterEnv.attack = s.filterAttack;
      this.filterEnv.decay = s.filterDecay;
      this.filterEnv.sustain = s.filterSustain;
      this.filterEnv.release = s.filterRelease;
    }
    if (
      state.ampAttack !== undefined ||
      state.ampDecay !== undefined ||
      state.ampSustain !== undefined ||
      state.ampRelease !== undefined
    ) {
      const env = {
        attack: s.ampAttack,
        decay: s.ampDecay,
        sustain: s.ampSustain,
        release: s.ampRelease,
      };
      this.osc1.set({ envelope: env });
      this.osc2.set({ envelope: env });
      this.sub.set({ envelope: env });
    }
    if (state.lfoRate !== undefined) {
      this.lfo.frequency.rampTo(s.lfoRate, 0.02);
    }
    if (state.lfoDepth !== undefined || state.lfoTarget !== undefined) {
      this.lfo.disconnect();
      if (s.lfoTarget === "filter" && s.lfoDepth > 0) {
        this.lfo.min = -s.lfoDepth * 2000;
        this.lfo.max = s.lfoDepth * 2000;
        this.lfo.connect(this.filter.frequency);
      } else if (s.lfoTarget === "amp" && s.lfoDepth > 0) {
        this.lfo.min = 1 - s.lfoDepth;
        this.lfo.max = 1;
        this.lfo.connect(this.out.gain);
      }
    }
    if (state.delayMix !== undefined) {
      this.delay.wet.rampTo(s.delayMix, 0.02);
    }
    if (state.delayTime !== undefined) {
      this.delay.delayTime.rampTo(s.delayTime, 0.02);
    }
    if (state.reverbMix !== undefined) {
      this.reverb.wet.rampTo(s.reverbMix, 0.02);
    }
    if (state.drive !== undefined) {
      this.drive.distortion = s.drive;
    }
    if (state.volume !== undefined) {
      this.out.gain.rampTo(Tone.dbToGain(s.volume), 0.05);
    }
  }

  get(): SynthState {
    return { ...this.state };
  }

  noteOn(note: string, velocity = 0.8) {
    const now = Tone.now();
    this.osc1.triggerAttack(note, now, velocity);
    this.osc2.triggerAttack(note, now, velocity);
    this.sub.triggerAttack(note, now, velocity);
    this.filterEnv.triggerAttack(now);
  }

  noteOff(note: string) {
    const now = Tone.now();
    this.osc1.triggerRelease(note, now);
    this.osc2.triggerRelease(note, now);
    this.sub.triggerRelease(note, now);
    this.filterEnv.triggerRelease(now);
  }

  releaseAll() {
    this.osc1.releaseAll();
    this.osc2.releaseAll();
    this.sub.releaseAll();
  }

  dispose() {
    this.releaseAll();
    this.osc1.dispose();
    this.osc2.dispose();
    this.sub.dispose();
    this.osc2Gain.dispose();
    this.subGain.dispose();
    this.filter.dispose();
    this.filterEnv.dispose();
    this.lfo.dispose();
    this.drive.dispose();
    this.delay.dispose();
    this.reverb.dispose();
    this.out.dispose();
  }
}
