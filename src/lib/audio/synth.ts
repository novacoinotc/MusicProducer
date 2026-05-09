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

type SynthOpts = ConstructorParameters<typeof Tone.Synth>[0];

/**
 * Subtractive synth with two oscillators + sub, shared filter + filter env,
 * LFO with switchable target, and a serial FX bus (drive → delay → reverb).
 *
 * Built around three PolySynth(Tone.Synth) instances rather than MonoSynth so
 * we don't fight MonoSynth's internal filter — our filter chain is the only
 * filter the signal sees.
 */
export class TechnoSynth {
  private out: Tone.Gain;
  private drive: Tone.Distortion;
  private delay: Tone.FeedbackDelay;
  private reverb: Tone.Reverb;
  private filter: Tone.Filter;
  private filterEnv: Tone.FrequencyEnvelope;
  private lfo: Tone.LFO;
  private lfoConnectedTo: Tone.InputNode | null = null;
  private osc1: Tone.PolySynth<Tone.Synth>;
  private osc2: Tone.PolySynth<Tone.Synth>;
  private sub: Tone.PolySynth<Tone.Synth>;
  private osc2Gain: Tone.Gain;
  private subGain: Tone.Gain;
  private state: SynthState = { ...DEFAULT_SYNTH };

  constructor() {
    const s = this.state;
    this.out = new Tone.Gain(Tone.dbToGain(s.volume)).toDestination();
    this.reverb = new Tone.Reverb({ decay: 3.5, wet: s.reverbMix }).connect(
      this.out,
    );
    this.delay = new Tone.FeedbackDelay({
      delayTime: s.delayTime,
      feedback: 0.35,
      wet: s.delayMix,
    }).connect(this.reverb);
    this.drive = new Tone.Distortion({ distortion: s.drive, wet: 1 }).connect(
      this.delay,
    );
    this.filter = new Tone.Filter({
      frequency: s.filterCutoff,
      type: s.filterType,
      Q: s.filterRes,
      rolloff: -24,
    }).connect(this.drive);
    this.filterEnv = new Tone.FrequencyEnvelope({
      attack: s.filterAttack,
      decay: s.filterDecay,
      sustain: s.filterSustain,
      release: s.filterRelease,
      baseFrequency: s.filterCutoff,
      octaves: s.filterEnvAmount * 4,
    }).connect(this.filter.frequency);

    const baseOpts = {
      envelope: {
        attack: s.ampAttack,
        decay: s.ampDecay,
        sustain: s.ampSustain,
        release: s.ampRelease,
      },
    };

    this.osc1 = new Tone.PolySynth(Tone.Synth, {
      ...baseOpts,
      oscillator: { type: s.osc1Type },
    } as unknown as SynthOpts).connect(this.filter);

    this.osc2Gain = new Tone.Gain(s.osc2Mix).connect(this.filter);
    this.osc2 = new Tone.PolySynth(Tone.Synth, {
      ...baseOpts,
      oscillator: { type: s.osc2Type, detune: s.osc2Detune },
    } as unknown as SynthOpts).connect(this.osc2Gain);

    this.subGain = new Tone.Gain(s.subLevel).connect(this.filter);
    this.sub = new Tone.PolySynth(Tone.Synth, {
      ...baseOpts,
      oscillator: { type: "sine" },
    } as unknown as SynthOpts).connect(this.subGain);

    // Construct with a non-degenerate range; the actual modulation depth is
    // applied by connectLfo. Crucially we do NOT start() the oscillator here
    // — Tone keeps emitting tiny non-zero samples (e.g. 1e-7) into the Scale
    // and if some other path narrows the range to [0, 0] briefly, the
    // assertion ("Value must be within [0, 0], got: 1e-7") fires on Safari.
    this.lfo = new Tone.LFO({
      frequency: s.lfoRate,
      min: -1,
      max: 1,
    });
  }

  private lfoStarted = false;

  private connectLfo(target: Tone.InputNode) {
    this.disconnectLfo();
    this.lfo.connect(target);
    this.lfoConnectedTo = target;
    if (!this.lfoStarted) {
      this.lfo.start();
      this.lfoStarted = true;
    }
  }

  private disconnectLfo() {
    if (!this.lfoConnectedTo) return;
    try {
      this.lfo.disconnect(this.lfoConnectedTo);
    } catch {
      // already disconnected
    }
    this.lfoConnectedTo = null;
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
        oscillator: { type: s.osc2Type, detune: s.osc2Detune },
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
      this.disconnectLfo();
      if (s.lfoTarget === "filter" && s.lfoDepth > 0) {
        this.lfo.min = -s.lfoDepth * 2000;
        this.lfo.max = s.lfoDepth * 2000;
        this.connectLfo(this.filter.frequency as unknown as Tone.InputNode);
      } else if (s.lfoTarget === "amp" && s.lfoDepth > 0) {
        this.lfo.min = 1 - s.lfoDepth;
        this.lfo.max = 1;
        this.connectLfo(this.out.gain as unknown as Tone.InputNode);
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
    this.disconnectLfo();
    if (this.lfoStarted) {
      try {
        this.lfo.stop();
      } catch {
        // already stopped
      }
    }
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
