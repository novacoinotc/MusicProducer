"use client";

import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { Pause, Play, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ensureAudio } from "@/lib/audio/engine";
import { cn } from "@/lib/utils";

const FREQ_BANDS = [
  { name: "Sub", from: 20, to: 60, color: "bg-rose-500" },
  { name: "Bass", from: 60, to: 250, color: "bg-amber-500" },
  { name: "Low mid", from: 250, to: 500, color: "bg-yellow-400" },
  { name: "Mid", from: 500, to: 2000, color: "bg-emerald-400" },
  { name: "High mid", from: 2000, to: 6000, color: "bg-cyan-400" },
  { name: "Air", from: 6000, to: 20000, color: "bg-violet-400" },
];

export function AudioAnalyzer() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveform, setWaveform] = useState<number[]>([]);
  const [bandLevels, setBandLevels] = useState<number[]>(
    Array(FREQ_BANDS.length).fill(0),
  );

  const playerRef = useRef<Tone.Player | null>(null);
  const fftRef = useRef<Tone.FFT | null>(null);
  const meterRef = useRef<Tone.Meter | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const startPosRef = useRef(0);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      playerRef.current?.dispose();
      fftRef.current?.dispose();
      meterRef.current?.dispose();
    };
  }, []);

  async function handleFile(file: File) {
    await ensureAudio();
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    // Compute waveform peaks
    const arrayBuffer = await file.arrayBuffer();
    const ctx = new AudioContext();
    const buf = await ctx.decodeAudioData(arrayBuffer.slice(0));
    setDuration(buf.duration);
    const peaks = computePeaks(buf, 800);
    setWaveform(peaks);

    // Set up Tone player + FFT
    playerRef.current?.dispose();
    fftRef.current?.dispose();
    meterRef.current?.dispose();

    const player = new Tone.Player({ url, autostart: false });
    await Tone.loaded();
    const fft = new Tone.FFT(2048);
    const meter = new Tone.Meter();
    player.connect(fft);
    player.connect(meter);
    player.toDestination();
    playerRef.current = player;
    fftRef.current = fft;
    meterRef.current = meter;

    setPosition(0);
    setIsPlaying(false);
  }

  function togglePlay() {
    const player = playerRef.current;
    if (!player) return;
    if (isPlaying) {
      player.stop();
      setIsPlaying(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    } else {
      player.start(undefined, position);
      startTimeRef.current = Tone.now();
      startPosRef.current = position;
      setIsPlaying(true);
      tick();
    }
  }

  function tick() {
    const player = playerRef.current;
    const fft = fftRef.current;
    if (!player || !fft) return;
    const elapsed = Tone.now() - startTimeRef.current + startPosRef.current;
    if (elapsed >= duration) {
      setPosition(0);
      setIsPlaying(false);
      return;
    }
    setPosition(elapsed);

    const values = fft.getValue() as Float32Array;
    const sampleRate = Tone.getContext().sampleRate;
    const binHz = sampleRate / 2 / values.length;
    const levels = FREQ_BANDS.map((b) => {
      const fromBin = Math.floor(b.from / binHz);
      const toBin = Math.min(values.length, Math.ceil(b.to / binHz));
      let sum = 0;
      let count = 0;
      for (let i = fromBin; i < toBin; i++) {
        // Convert dB to linear and average
        const v = values[i];
        if (Number.isFinite(v)) {
          sum += Math.max(0, v + 100); // shift floor
          count++;
        }
      }
      return count ? Math.min(1, sum / count / 100) : 0;
    });
    setBandLevels(levels);

    rafRef.current = requestAnimationFrame(tick);
  }

  function clear() {
    playerRef.current?.stop();
    playerRef.current?.dispose();
    playerRef.current = null;
    setAudioUrl(null);
    setFileName(null);
    setIsPlaying(false);
    setPosition(0);
    setWaveform([]);
    setBandLevels(Array(FREQ_BANDS.length).fill(0));
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }

  function seekFromClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!playerRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const newPos = ratio * duration;
    setPosition(newPos);
    if (isPlaying) {
      playerRef.current.stop();
      playerRef.current.start(undefined, newPos);
      startTimeRef.current = Tone.now();
      startPosRef.current = newPos;
    }
  }

  if (!audioUrl) {
    return (
      <div className="rounded-xl border-2 border-dashed bg-card p-12 text-center">
        <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 font-medium">Sube un track de referencia</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          MP3, WAV, OGG. El archivo no sale de tu navegador.
        </p>
        <label className="mt-6 inline-block">
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <span className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Upload className="h-4 w-4" />
            Elegir archivo
          </span>
        </label>
      </div>
    );
  }

  const positionPct = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
        <Button size="icon" onClick={togglePlay} className="h-10 w-10 rounded-full">
          {isPlaying ? <Pause /> : <Play />}
        </Button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm">{fileName}</p>
          <p className="font-mono text-[10px] tabular-nums text-muted-foreground">
            {formatTime(position)} / {formatTime(duration)}
          </p>
        </div>
        <Button size="icon" variant="ghost" onClick={clear} aria-label="Quitar">
          <X />
        </Button>
      </div>

      {/* Waveform + playhead */}
      <div
        className="relative h-32 cursor-pointer rounded-lg border bg-secondary/20 p-2"
        onClick={seekFromClick}
      >
        <Waveform peaks={waveform} />
        <div
          className="absolute inset-y-0 w-px bg-primary"
          style={{ left: `${positionPct}%` }}
        />
      </div>

      {/* Frequency bands */}
      <div className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-6">
        {FREQ_BANDS.map((b, i) => {
          const lvl = bandLevels[i] ?? 0;
          return (
            <div key={b.name} className="flex flex-col items-center gap-2">
              <div className="relative h-24 w-6 overflow-hidden rounded-sm bg-secondary/40">
                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 transition-[height] duration-75",
                    b.color,
                  )}
                  style={{ height: `${lvl * 100}%` }}
                />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {b.name}
              </span>
              <span className="font-mono text-[9px] text-foreground/60">
                {b.from < 1000 ? b.from : `${b.from / 1000}k`}–
                {b.to < 1000 ? b.to : `${b.to / 1000}k`}Hz
              </span>
            </div>
          );
        })}
      </div>

      {/* Layer guide */}
      <div className="rounded-lg border bg-card p-5">
        <h3 className="font-mono text-xs uppercase tracking-wider text-primary">
          Cómo deconstruir mientras escuchas
        </h3>
        <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>
            <span className="text-foreground">1.</span> Identifica el{" "}
            <strong>kick</strong>: ¿es punchy o más subby? Mira la banda Bass.
          </li>
          <li>
            <span className="text-foreground">2.</span> Sube el oído a la{" "}
            <strong>hat/clap</strong>: ¿está en off-beat o en 16ths?
          </li>
          <li>
            <span className="text-foreground">3.</span> Encuentra el{" "}
            <strong>bassline</strong> (60-200 Hz). ¿Es un sub plano o tiene
            movimiento?
          </li>
          <li>
            <span className="text-foreground">4.</span> Identifica la{" "}
            <strong>melodía/lead</strong> (500 Hz - 4 kHz). ¿Pluck, stab, pad?
          </li>
          <li>
            <span className="text-foreground">5.</span> Marca dónde están los{" "}
            <strong>cambios de sección</strong> (intro / build / drop /
            breakdown).
          </li>
          <li>
            <span className="text-foreground">6.</span> Replica el groove en el
            Groove Lab y el sonido en el Sound Design Lab.
          </li>
        </ol>
      </div>
    </div>
  );
}

function Waveform({ peaks }: { peaks: number[] }) {
  if (!peaks.length) return null;
  const max = Math.max(...peaks, 0.001);
  return (
    <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 800 100">
      {peaks.map((p, i) => {
        const h = (p / max) * 90;
        const x = (i / peaks.length) * 800;
        return (
          <rect
            key={i}
            x={x}
            y={50 - h / 2}
            width={800 / peaks.length}
            height={h}
            fill="currentColor"
            className="text-foreground/50"
          />
        );
      })}
    </svg>
  );
}

function computePeaks(buf: AudioBuffer, n: number) {
  const channel = buf.getChannelData(0);
  const blockSize = Math.floor(channel.length / n);
  const peaks: number[] = [];
  for (let i = 0; i < n; i++) {
    let max = 0;
    const start = i * blockSize;
    const end = Math.min(channel.length, start + blockSize);
    for (let j = start; j < end; j++) {
      const v = Math.abs(channel[j]);
      if (v > max) max = v;
    }
    peaks.push(max);
  }
  return peaks;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
