"use client";

export interface BarBlock {
  bar: number; // bar index (0-based)
  startSec: number;
  endSec: number;
  energy: number; // 0..1, normalized energy of the bar
  brightness: number; // 0..1, ratio of high-band energy
}

export interface TrackSection {
  type: "intro" | "build" | "drop" | "groove" | "breakdown" | "outro";
  startBar: number;
  endBar: number; // inclusive
  startSec: number;
  endSec: number;
  avgEnergy: number;
  bars: BarBlock[];
}

export interface TrackAnalysis {
  bpm: number;
  durationSec: number;
  totalBars: number;
  beatsPerBar: number;
  bars: BarBlock[];
  sections: TrackSection[];
}

/**
 * Estimate BPM by looking at the autocorrelation of the low-frequency energy
 * envelope. Crude but works for techno/house where the kick is on every beat.
 */
function detectBpm(buf: AudioBuffer): number {
  const sr = buf.sampleRate;
  const data = buf.getChannelData(0);

  // Build a ~100 Hz envelope of low-band energy (rough kick proxy)
  const winSize = Math.floor(sr / 100); // 100 envelope samples per second
  const envSize = Math.floor(data.length / winSize);
  const env = new Float32Array(envSize);
  let prevLow = 0;
  // 1-pole low-pass (~200Hz) on the input as we read it
  const lpAlpha = Math.exp(-2 * Math.PI * 200 / sr);
  for (let i = 0; i < envSize; i++) {
    const start = i * winSize;
    const end = start + winSize;
    let sum = 0;
    for (let j = start; j < end; j++) {
      // running low-pass
      prevLow = lpAlpha * prevLow + (1 - lpAlpha) * data[j];
      sum += prevLow * prevLow;
    }
    env[i] = Math.sqrt(sum / winSize);
  }

  // Half-wave rectified differentiation to emphasize onsets
  const onset = new Float32Array(envSize);
  for (let i = 1; i < envSize; i++) {
    const d = env[i] - env[i - 1];
    onset[i] = d > 0 ? d : 0;
  }

  // Autocorrelate the onset signal at lag values inside our target BPM range.
  // env is at 100 Hz → lag (samples) = 60 * 100 / BPM.
  // We scan 100..150 BPM directly so we never need a halve/double octave fix.
  const minLag = Math.round((60 * 100) / 150); // 40
  const maxLag = Math.round((60 * 100) / 100); // 60

  let bestLag = minLag;
  let bestScore = 0;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let acc = 0;
    for (let i = 0; i + lag < envSize; i++) {
      acc += onset[i] * onset[i + lag];
    }
    // Bias toward typical techno tempos (peak around 128) to break ties
    const bpmHere = (60 * 100) / lag;
    const techoPrior = Math.exp(-Math.pow((bpmHere - 128) / 18, 2));
    const score = acc * (0.7 + 0.3 * techoPrior);
    if (score > bestScore) {
      bestScore = score;
      bestLag = lag;
    }
  }
  return Math.round((60 * 100) / bestLag);
}

function computeBars(buf: AudioBuffer, bpm: number): BarBlock[] {
  const sr = buf.sampleRate;
  const beatSec = 60 / bpm;
  const barSec = beatSec * 4;
  const totalBars = Math.floor(buf.duration / barSec);

  const data = buf.getChannelData(0);

  const bars: BarBlock[] = [];
  let maxEnergy = 0;

  for (let b = 0; b < totalBars; b++) {
    const startSec = b * barSec;
    const endSec = startSec + barSec;
    const startSample = Math.floor(startSec * sr);
    const endSample = Math.min(data.length, Math.floor(endSec * sr));

    let energySum = 0;
    let highSum = 0;
    let prev = 0;
    let prevDiff = 0;

    // High-pass approximation by tracking sample-to-sample difference
    for (let i = startSample; i < endSample; i++) {
      const s = data[i];
      energySum += s * s;
      const diff = s - prev;
      // Second derivative-ish gives us emphasis on high frequencies
      const hp = diff - prevDiff;
      highSum += hp * hp;
      prevDiff = diff;
      prev = s;
    }
    const n = Math.max(1, endSample - startSample);
    const energy = Math.sqrt(energySum / n);
    const brightness = Math.sqrt(highSum / n);
    if (energy > maxEnergy) maxEnergy = energy;

    bars.push({
      bar: b,
      startSec,
      endSec,
      energy,
      brightness,
    });
  }

  // Normalize energy + brightness to 0..1
  let maxBright = 0;
  for (const b of bars) if (b.brightness > maxBright) maxBright = b.brightness;
  for (const b of bars) {
    b.energy = maxEnergy > 0 ? Math.min(1, b.energy / maxEnergy) : 0;
    b.brightness =
      maxBright > 0 ? Math.min(1, b.brightness / maxBright) : 0;
  }

  return bars;
}

function detectSections(bars: BarBlock[]): TrackSection[] {
  if (bars.length === 0) return [];

  // Smooth energy with a 4-bar moving average for stability
  const win = 4;
  const smooth: number[] = [];
  for (let i = 0; i < bars.length; i++) {
    const start = Math.max(0, i - Math.floor(win / 2));
    const end = Math.min(bars.length, i + Math.floor(win / 2) + 1);
    let s = 0;
    for (let j = start; j < end; j++) s += bars[j].energy;
    smooth.push(s / (end - start));
  }

  // Classify each bar by energy threshold
  type Level = "low" | "mid" | "high";
  const level = (e: number): Level =>
    e < 0.32 ? "low" : e < 0.7 ? "mid" : "high";

  // Group consecutive bars sharing the same level
  const groups: { level: Level; from: number; to: number }[] = [];
  let curLevel = level(smooth[0]);
  let groupStart = 0;
  for (let i = 1; i < smooth.length; i++) {
    const lv = level(smooth[i]);
    if (lv !== curLevel) {
      groups.push({ level: curLevel, from: groupStart, to: i - 1 });
      curLevel = lv;
      groupStart = i;
    }
  }
  groups.push({
    level: curLevel,
    from: groupStart,
    to: smooth.length - 1,
  });

  // Merge groups that are too short (< 8 bars — typical techno block) into the
  // previous one. Run repeatedly until stable so chains of short groups
  // collapse into the bigger surrounding section.
  let merged: typeof groups = groups.map((g) => ({ ...g }));
  let stable = false;
  while (!stable) {
    stable = true;
    const next: typeof groups = [];
    for (const g of merged) {
      const len = g.to - g.from + 1;
      if (next.length && len < 8) {
        next[next.length - 1].to = g.to;
        stable = false;
      } else {
        next.push({ ...g });
      }
    }
    merged = next;
  }

  // Map levels to section types using context (position + transition)
  const last = merged.length - 1;
  const sections: TrackSection[] = merged.map((g, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === last;
    const prev = idx > 0 ? merged[idx - 1] : null;
    const next = idx < last ? merged[idx + 1] : null;

    let type: TrackSection["type"];
    if (g.level === "low") {
      if (isFirst) type = "intro";
      else if (isLast) type = "outro";
      else type = "breakdown";
    } else if (g.level === "high") {
      type = "drop";
    } else {
      // mid
      if (prev && prev.level === "low" && next && next.level === "high") {
        type = "build";
      } else {
        type = "groove";
      }
    }

    const groupBars = bars.slice(g.from, g.to + 1);
    const avgEnergy =
      groupBars.reduce((a, b) => a + b.energy, 0) / groupBars.length;
    return {
      type,
      startBar: g.from,
      endBar: g.to,
      startSec: bars[g.from].startSec,
      endSec: bars[g.to].endSec,
      avgEnergy,
      bars: groupBars,
    };
  });

  return sections;
}

export function analyzeTrack(buf: AudioBuffer): TrackAnalysis {
  const bpm = detectBpm(buf);
  const bars = computeBars(buf, bpm);
  const sections = detectSections(bars);
  return {
    bpm,
    durationSec: buf.duration,
    totalBars: bars.length,
    beatsPerBar: 4,
    bars,
    sections,
  };
}

export const SECTION_LABEL: Record<TrackSection["type"], string> = {
  intro: "Intro",
  build: "Build",
  drop: "Drop",
  groove: "Groove",
  breakdown: "Breakdown",
  outro: "Outro",
};

export const SECTION_COLOR: Record<TrackSection["type"], string> = {
  intro: "bg-cyan-500/40 border-cyan-400",
  build: "bg-amber-500/40 border-amber-400",
  drop: "bg-rose-500/50 border-rose-400",
  groove: "bg-violet-500/40 border-violet-400",
  breakdown: "bg-emerald-500/40 border-emerald-400",
  outro: "bg-zinc-500/40 border-zinc-400",
};
