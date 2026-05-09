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
  console.info("[engine] ensureAudio start", {
    contextState: ctx.state,
    rawState: (ctx.rawContext as AudioContext)?.state,
    sampleRate: ctx.sampleRate,
    destinationVolume:
      (Tone.getDestination() as unknown as { volume: { value: number } })
        ?.volume?.value,
  });

  if (ctx.state === "running") {
    console.info("[engine] context already running, skipping start");
    return Tone;
  }

  await Tone.start();
  console.info("[engine] Tone.start() resolved", {
    contextState: Tone.getContext().state,
  });

  const raw = ctx.rawContext as AudioContext;
  if (raw && raw.state !== "running") {
    try {
      await raw.resume();
      console.info("[engine] rawContext.resume() resolved", {
        rawState: raw.state,
      });
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
  console.info("[engine] audio is now running");
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
  // Make sure Master/Destination is fully audible. If something earlier
  // muted it, the user would hear silence even with a fresh oscillator.
  const dest = Tone.getDestination();
  console.info("[beep] destination state", {
    volume: (dest as unknown as { volume: { value: number } }).volume?.value,
    mute: (dest as unknown as { mute: boolean }).mute,
  });
  if ((dest as unknown as { mute: boolean }).mute) {
    (dest as unknown as { mute: boolean }).mute = false;
    console.warn("[beep] destination was muted — unmuted");
  }
  if (
    (dest as unknown as { volume: { value: number } }).volume?.value === -Infinity
  ) {
    (dest as unknown as { volume: { value: number } }).volume.value = 0;
    console.warn("[beep] destination volume was -Infinity — reset to 0 dB");
  }
  const beep = new Tone.Oscillator({
    frequency: 440,
    type: "sine",
    volume: -6,
  }).toDestination();
  const now = Tone.now();
  beep.start(now);
  beep.stop(now + 0.4);
  console.info("[beep] scheduled", { now, freq: 440 });
  setTimeout(() => beep.dispose(), 800);
}

export { Tone };
