"use client";

import * as Tone from "tone";

export type DrumVoice = "kick" | "clap" | "hat" | "perc" | "ohat" | "rim";

export interface DrumKit {
  trigger: (voice: DrumVoice, time: number, velocity?: number) => void;
  setVolume: (db: number) => void;
  dispose: () => void;
}

/**
 * Synthesized techno drum kit. Each voice is generated with Tone.js synths so
 * the app stays sample-free. Hats and rim use NoiseSynth + filters because
 * MetalSynth requires a `note` arg in its triggerAttackRelease signature and
 * was producing silent triggers when called with only a duration.
 */
export function createDrumKit(): DrumKit {
  const out = new Tone.Gain(1).toDestination();

  // Kick — classic four-on-the-floor with pitched envelope
  const kick = new Tone.MembraneSynth({
    pitchDecay: 0.04,
    octaves: 6,
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.001,
      decay: 0.4,
      sustain: 0.01,
      release: 1.2,
      attackCurve: "exponential",
    },
    volume: -2,
  }).connect(out);

  // Clap — short noise burst through bandpass
  const clapNoise = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.05 },
    volume: -6,
  });
  const clapFilter = new Tone.Filter(1200, "bandpass").connect(out);
  clapFilter.Q.value = 1.2;
  clapNoise.connect(clapFilter);

  // Closed hat — bright noise burst, very short envelope
  const hatNoise = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.02 },
    volume: -8,
  });
  const hatFilter = new Tone.Filter(7000, "highpass").connect(out);
  hatFilter.Q.value = 0.8;
  hatNoise.connect(hatFilter);

  // Open hat — same idea, longer decay (own filter so it can run independently)
  const ohatNoise = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.32, sustain: 0, release: 0.18 },
    volume: -10,
  });
  const ohatFilter = new Tone.Filter(7000, "highpass").connect(out);
  ohatFilter.Q.value = 0.8;
  ohatNoise.connect(ohatFilter);

  // Percussion — woody tom-ish blip
  const perc = new Tone.MembraneSynth({
    pitchDecay: 0.008,
    octaves: 2,
    oscillator: { type: "triangle" },
    envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.1 },
    volume: -8,
  }).connect(out);

  // Rim — sharp noise transient through bandpass + a short pitched click
  const rimNoise = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.03, sustain: 0, release: 0.01 },
    volume: -10,
  });
  const rimFilter = new Tone.Filter(2200, "bandpass").connect(out);
  rimFilter.Q.value = 4;
  rimNoise.connect(rimFilter);
  const rimClick = new Tone.MembraneSynth({
    pitchDecay: 0.002,
    octaves: 1,
    oscillator: { type: "square" },
    envelope: { attack: 0.001, decay: 0.02, sustain: 0, release: 0.02 },
    volume: -16,
  }).connect(out);

  return {
    trigger(voice, time, velocity = 1) {
      const vel = Math.max(0, Math.min(1, velocity));
      switch (voice) {
        case "kick":
          kick.triggerAttackRelease("C1", "8n", time, vel);
          break;
        case "clap":
          clapNoise.triggerAttackRelease("16n", time, vel);
          break;
        case "hat":
          hatNoise.triggerAttackRelease("32n", time, vel * 0.9);
          break;
        case "ohat":
          ohatNoise.triggerAttackRelease("8n", time, vel * 0.9);
          break;
        case "perc":
          perc.triggerAttackRelease("G3", "16n", time, vel);
          break;
        case "rim":
          rimNoise.triggerAttackRelease("32n", time, vel);
          rimClick.triggerAttackRelease("F4", "32n", time, vel * 0.6);
          break;
      }
    },
    setVolume(db) {
      out.gain.rampTo(Tone.dbToGain(db), 0.05);
    },
    dispose() {
      kick.dispose();
      clapNoise.dispose();
      clapFilter.dispose();
      hatNoise.dispose();
      hatFilter.dispose();
      ohatNoise.dispose();
      ohatFilter.dispose();
      perc.dispose();
      rimNoise.dispose();
      rimFilter.dispose();
      rimClick.dispose();
      out.dispose();
    },
  };
}
