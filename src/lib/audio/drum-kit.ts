"use client";

import * as Tone from "tone";

export type DrumVoice = "kick" | "clap" | "hat" | "perc" | "ohat" | "rim";

export interface DrumKit {
  trigger: (voice: DrumVoice, time: number, velocity?: number) => void;
  setVolume: (db: number) => void;
  dispose: () => void;
}

/**
 * Synthesized techno drum kit. No samples — every voice is generated with Tone.js
 * synths so the app stays small and works offline.
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

  // Clap — noise burst with short envelope chain
  const clapNoise = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.05 },
    volume: -8,
  });
  const clapFilter = new Tone.Filter(1100, "bandpass").connect(out);
  clapFilter.Q.value = 1.2;
  clapNoise.connect(clapFilter);

  // Closed hat
  const hat = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.04, release: 0.02 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
    volume: -22,
  });
  const hatFilter = new Tone.Filter(8000, "highpass").connect(out);
  hat.connect(hatFilter);

  // Open hat — same metal synth with longer envelope
  const ohat = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.3, release: 0.2 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
    volume: -22,
  });
  ohat.connect(hatFilter);

  // Percussion — woody tom-ish blip
  const perc = new Tone.MembraneSynth({
    pitchDecay: 0.008,
    octaves: 2,
    oscillator: { type: "triangle" },
    envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.1 },
    volume: -10,
  }).connect(out);

  // Rim shot
  const rim = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.02, release: 0.01 },
    harmonicity: 12,
    modulationIndex: 50,
    resonance: 7000,
    octaves: 0.5,
    volume: -18,
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
          hat.triggerAttackRelease("32n", time, vel * 0.7);
          break;
        case "ohat":
          ohat.triggerAttackRelease("8n", time, vel * 0.7);
          break;
        case "perc":
          perc.triggerAttackRelease("G3", "16n", time, vel);
          break;
        case "rim":
          rim.triggerAttackRelease("16n", time, vel);
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
      hat.dispose();
      ohat.dispose();
      hatFilter.dispose();
      perc.dispose();
      rim.dispose();
      out.dispose();
    },
  };
}
