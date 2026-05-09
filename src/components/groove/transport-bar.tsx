"use client";

import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TransportBar({
  isPlaying,
  onToggle,
  onClear,
  bpm,
  onBpmChange,
  swing,
  onSwingChange,
  volume,
  onVolumeChange,
}: {
  isPlaying: boolean;
  onToggle: () => void;
  onClear: () => void;
  bpm: number;
  onBpmChange: (v: number) => void;
  swing: number;
  onSwingChange: (v: number) => void;
  volume: number;
  onVolumeChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4">
      <Button
        size="icon"
        onClick={onToggle}
        className={cn(
          "h-12 w-12 rounded-full",
          isPlaying && "bg-primary/20 text-primary hover:bg-primary/30",
        )}
        variant={isPlaying ? "secondary" : "default"}
        aria-label={isPlaying ? "Pausar" : "Reproducir"}
      >
        {isPlaying ? <Pause className="!h-5 !w-5" /> : <Play className="!h-5 !w-5" />}
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={onClear}
        aria-label="Limpiar patrón"
      >
        <RotateCcw />
      </Button>

      <Knob
        label="BPM"
        value={bpm}
        min={80}
        max={160}
        step={1}
        onChange={onBpmChange}
        format={(v) => `${v}`}
      />

      <Knob
        label="Swing"
        value={swing * 100}
        min={0}
        max={50}
        step={1}
        onChange={(v) => onSwingChange(v / 100)}
        format={(v) => `${Math.round(v)}%`}
      />

      <div className="ml-auto flex items-center gap-3">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        <input
          type="range"
          min={-30}
          max={6}
          step={1}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="h-1 w-32 cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
          aria-label="Volumen"
        />
        <span className="w-10 text-right font-mono text-xs text-muted-foreground">
          {volume > 0 ? `+${volume}` : volume}dB
        </span>
      </div>
    </div>
  );
}

function Knob({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!Number.isNaN(v)) onChange(v);
        }}
        className="h-8 w-16 rounded-md border bg-background px-2 text-center font-mono text-sm tabular-nums focus:outline-none focus:ring-1 focus:ring-ring"
      />
      <span className="font-mono text-xs text-muted-foreground">
        {format(value)}
      </span>
    </label>
  );
}
