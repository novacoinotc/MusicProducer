"use client";

import * as Tone from "tone";

let started = false;

export async function ensureAudio(): Promise<typeof Tone> {
  if (typeof window === "undefined") {
    throw new Error("Audio engine can only run in the browser");
  }
  if (!started) {
    await Tone.start();
    started = true;
  }
  return Tone;
}

export function isAudioReady() {
  return started;
}

export { Tone };
