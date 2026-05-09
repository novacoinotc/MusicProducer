"use client";

import { emptyPattern, type Pattern } from "@/lib/audio/sequencer";
import type { DrumVoice } from "@/lib/audio/drum-kit";

const STEPS = 16;

/**
 * Slice an AudioBuffer between two time offsets into a fresh AudioBuffer.
 */
function sliceBuffer(
  buf: AudioBuffer,
  startSec: number,
  durationSec: number,
): AudioBuffer {
  const sr = buf.sampleRate;
  const startSample = Math.max(0, Math.floor(startSec * sr));
  const lengthSamples = Math.min(
    buf.length - startSample,
    Math.floor(durationSec * sr),
  );
  const ctx = new AudioContext();
  const out = ctx.createBuffer(buf.numberOfChannels, lengthSamples, sr);
  for (let ch = 0; ch < buf.numberOfChannels; ch++) {
    const src = buf.getChannelData(ch);
    const dst = out.getChannelData(ch);
    for (let i = 0; i < lengthSamples; i++) {
      dst[i] = src[startSample + i] ?? 0;
    }
  }
  ctx.close();
  return out;
}

/**
 * Bandpass-filter the buffer offline using two cascaded biquads and return
 * the rendered AudioBuffer.
 */
async function bandpass(
  buf: AudioBuffer,
  fLow: number,
  fHigh: number,
): Promise<AudioBuffer> {
  const ctx = new OfflineAudioContext(1, buf.length, buf.sampleRate);
  const source = ctx.createBufferSource();
  source.buffer = buf;

  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass";
  hpf.frequency.value = fLow;
  hpf.Q.value = 0.707;

  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = fHigh;
  lpf.Q.value = 0.707;

  source.connect(hpf).connect(lpf).connect(ctx.destination);
  source.start(0);
  return await ctx.startRendering();
}

/**
 * Detect onset times (seconds) from an AudioBuffer using RMS envelope peak
 * picking. Tuned for 10ms hop and a 40 ms minimum spacing between onsets.
 */
function detectOnsets(buf: AudioBuffer, threshold = 0.35): number[] {
  const data = buf.getChannelData(0);
  const sr = buf.sampleRate;
  const hopMs = 10;
  const hopSize = Math.max(1, Math.floor((sr * hopMs) / 1000));
  const envLen = Math.floor(data.length / hopSize);
  const env = new Float32Array(envLen);

  for (let i = 0; i < envLen; i++) {
    const start = i * hopSize;
    const end = Math.min(data.length, start + hopSize);
    let sum = 0;
    for (let j = start; j < end; j++) sum += data[j] * data[j];
    env[i] = Math.sqrt(sum / Math.max(1, end - start));
  }

  let max = 0;
  for (let i = 0; i < envLen; i++) if (env[i] > max) max = env[i];
  if (max === 0) return [];

  const cutoff = max * threshold;
  const onsets: number[] = [];
  let lastOnsetMs = -Infinity;
  for (let i = 1; i < envLen - 1; i++) {
    if (
      env[i] > cutoff &&
      env[i] > env[i - 1] &&
      env[i] >= env[i + 1]
    ) {
      const tMs = i * hopMs;
      if (tMs - lastOnsetMs >= 40) {
        onsets.push(tMs / 1000);
        lastOnsetMs = tMs;
      }
    }
  }
  return onsets;
}

interface BandSpec {
  voice: DrumVoice;
  fLow: number;
  fHigh: number;
  threshold: number;
}

const BANDS: BandSpec[] = [
  { voice: "kick", fLow: 35, fHigh: 140, threshold: 0.45 },
  { voice: "clap", fLow: 250, fHigh: 1200, threshold: 0.5 },
  { voice: "hat", fLow: 6000, fHigh: 14000, threshold: 0.35 },
];

/**
 * Extract a 16-step drum pattern from one bar of audio starting at
 * `startSec`, by analysing onsets in three frequency bands.
 *
 * The result is best-effort — overlapping voices in the same band will land
 * on the same row, and quantisation snaps everything to 16ths even if the
 * source has swing or syncopation. Users can refine the result manually.
 */
export async function extractPatternFromBar(
  buf: AudioBuffer,
  startSec: number,
  bpm: number,
): Promise<Pattern> {
  const barSec = (60 * 4) / bpm;
  const slice = sliceBuffer(buf, startSec, barSec);

  const pattern = emptyPattern();
  const stepDur = barSec / STEPS;

  for (const band of BANDS) {
    const filtered = await bandpass(slice, band.fLow, band.fHigh);
    const onsets = detectOnsets(filtered, band.threshold);
    for (const t of onsets) {
      const step = Math.round(t / stepDur);
      if (step >= 0 && step < STEPS) {
        pattern[band.voice][step] = true;
      }
    }
  }

  return pattern;
}
