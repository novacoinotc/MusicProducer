"use client";

import * as Tone from "tone";

/**
 * Robust audio engine bootstrapping. Browsers suspend AudioContexts after
 * navigation, tab-switching, or inactivity, so checking a cached `started`
 * flag is not enough — we must always verify the actual context state on
 * every call and resume if needed. Must be invoked from inside a user
 * gesture (click/tap) on the very first call.
 */
export async function ensureAudio(): Promise<typeof Tone> {
  if (typeof window === "undefined") {
    throw new Error("Audio engine can only run in the browser");
  }

  const ctx = Tone.getContext();
  if (ctx.state === "running") {
    return Tone;
  }

  // First-time gesture or post-suspension resume: ask Tone to start, then
  // belt-and-suspenders against rawContext still being suspended.
  await Tone.start();

  const raw = ctx.rawContext as AudioContext;
  if (raw && raw.state !== "running") {
    try {
      await raw.resume();
    } catch (e) {
      console.error("[engine] rawContext.resume failed", e);
    }
  }

  if (Tone.getContext().state !== "running") {
    throw new Error(
      `No se pudo iniciar el audio (estado: ${Tone.getContext().state}). ` +
        "Verifica que tu navegador no tenga la pestaña silenciada y que el volumen del sistema esté arriba.",
    );
  }
  return Tone;
}

export function audioContextState() {
  if (typeof window === "undefined") return "ssr";
  return Tone.getContext().state;
}

/**
 * Play a short beep so the user can confirm audio works on their machine.
 * Exposed for diagnostic UIs.
 */
export async function playTestBeep() {
  await ensureAudio();
  const beep = new Tone.Oscillator({
    frequency: 440,
    type: "sine",
    volume: -6,
  }).toDestination();
  const now = Tone.now();
  beep.start(now);
  beep.stop(now + 0.4);
  // Dispose after it stops to free the node
  setTimeout(() => beep.dispose(), 800);
}

export { Tone };
