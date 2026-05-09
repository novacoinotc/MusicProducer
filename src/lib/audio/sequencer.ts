"use client";

import * as Tone from "tone";
import { createDrumKit, type DrumKit, type DrumVoice } from "./drum-kit";

export type Pattern = Record<DrumVoice, boolean[]>;

export const STEPS = 16;

export const VOICES: DrumVoice[] = [
  "kick",
  "clap",
  "ohat",
  "hat",
  "perc",
  "rim",
];

export function emptyPattern(): Pattern {
  return Object.fromEntries(
    VOICES.map((v) => [v, Array(STEPS).fill(false)]),
  ) as Pattern;
}

/**
 * Lightweight wrapper around Tone.Transport + Sequence so React state can drive
 * a step sequencer without re-creating audio nodes on every render.
 */
export class StepSequencer {
  private kit: DrumKit;
  private repeatId: number | null = null;
  private patternRef: Pattern = emptyPattern();
  private stepListener: ((step: number) => void) | null = null;
  private currentStep = -1;

  constructor() {
    this.kit = createDrumKit();
  }

  setPattern(p: Pattern) {
    this.patternRef = p;
  }

  setBpm(bpm: number) {
    Tone.getTransport().bpm.rampTo(bpm, 0.05);
  }

  setSwing(amount: number) {
    Tone.getTransport().swing = Math.max(0, Math.min(0.5, amount));
    Tone.getTransport().swingSubdivision = "16n";
  }

  setVolume(db: number) {
    this.kit.setVolume(db);
  }

  onStep(cb: (step: number) => void) {
    this.stepListener = cb;
  }

  async start() {
    if (this.repeatId !== null) return;
    const transport = Tone.getTransport();
    let step = 0;
    this.repeatId = transport.scheduleRepeat((time) => {
      const localStep = step % STEPS;
      this.currentStep = localStep;
      VOICES.forEach((v) => {
        if (this.patternRef[v][localStep]) {
          this.kit.trigger(v, time);
        }
      });
      Tone.getDraw().schedule(() => {
        this.stepListener?.(localStep);
      }, time);
      step += 1;
    }, "16n");

    transport.position = 0;
    transport.start();
  }

  stop() {
    const transport = Tone.getTransport();
    transport.stop();
    if (this.repeatId !== null) {
      transport.clear(this.repeatId);
      this.repeatId = null;
    }
    this.currentStep = -1;
    this.stepListener?.(-1);
  }

  toggle() {
    if (this.repeatId !== null) {
      this.stop();
    } else {
      this.start();
    }
  }

  isPlaying() {
    return this.repeatId !== null;
  }

  dispose() {
    this.stop();
    this.kit.dispose();
  }
}
