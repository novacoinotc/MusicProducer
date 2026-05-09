"use client";

import * as Tone from "tone";

let piano: Tone.PolySynth | null = null;

/**
 * Lightweight polyphonic synth used by the ear-training module to play notes,
 * intervals, scales and chord progressions. Reused across exercises.
 */
export function getPiano() {
  if (!piano) {
    piano = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: {
        attack: 0.005,
        decay: 0.2,
        sustain: 0.3,
        release: 1.2,
      },
      volume: -10,
    });
    const reverb = new Tone.Reverb({ decay: 2, wet: 0.18 }).toDestination();
    piano.connect(reverb);
  }
  return piano;
}

export function playSequence(
  notes: string[],
  noteDur = 0.45,
  gap = 0.1,
) {
  const p = getPiano();
  const now = Tone.now() + 0.05;
  notes.forEach((n, i) => {
    p.triggerAttackRelease(n, noteDur, now + i * (noteDur + gap));
  });
}

export function playChord(notes: string[], dur = 1.2) {
  const p = getPiano();
  p.triggerAttackRelease(notes, dur, Tone.now() + 0.05);
}

export function playProgression(chords: string[][], chordDur = 1.2) {
  const p = getPiano();
  const now = Tone.now() + 0.05;
  chords.forEach((c, i) => {
    p.triggerAttackRelease(c, chordDur, now + i * chordDur);
  });
}
