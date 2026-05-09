"use client";

import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Melody } from "@/lib/audio/studio-engine";

const DEGREE_COLOR: string[] = [
  "", // 0 unused (we use null for empty)
  "bg-rose-500",
  "bg-orange-400",
  "bg-amber-400",
  "bg-yellow-400",
  "bg-emerald-400",
  "bg-cyan-400",
  "bg-violet-400",
];

/**
 * One row of 16 cells. Click cycles a cell through scale degrees 1-7 then back
 * to empty. Right-click clears.
 */
export function MelodyTrackRow({
  label,
  color,
  melody,
  octave,
  onChange,
  onOctaveChange,
  muted,
  onMute,
  currentStep,
}: {
  label: string;
  color: string;
  melody: Melody;
  octave: number;
  onChange: (m: Melody) => void;
  onOctaveChange: (o: number) => void;
  muted: boolean;
  onMute: (m: boolean) => void;
  currentStep: number;
}) {
  function cycle(step: number) {
    const next = [...melody];
    const cur = next[step];
    next[step] = cur === null ? 1 : cur >= 7 ? null : (cur + 1);
    onChange(next);
  }

  function clear(step: number) {
    const next = [...melody];
    next[step] = null;
    onChange(next);
  }

  return (
    <div className="grid grid-cols-[120px_1fr] items-center gap-3 rounded-lg border bg-card p-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", color)} />
          <span className="font-mono text-xs uppercase tracking-wider text-foreground">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMute(!muted)}
            className={cn(
              "rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors",
              muted
                ? "border-rose-500/60 bg-rose-500/20 text-rose-400"
                : "border-border text-muted-foreground hover:bg-secondary",
            )}
          >
            {muted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
          </button>
          <span className="font-mono text-[10px] text-muted-foreground">oct</span>
          <input
            type="number"
            min={1}
            max={6}
            value={octave}
            onChange={(e) => onOctaveChange(Number(e.target.value))}
            className="h-6 w-10 rounded-md border bg-background px-1 text-center font-mono text-xs"
          />
        </div>
      </div>
      <div className="grid grid-cols-16 gap-1">
        {melody.map((degree, i) => {
          const isDownbeat = i % 4 === 0;
          const isPlaying = currentStep === i;
          return (
            <button
              key={i}
              onClick={() => cycle(i)}
              onContextMenu={(e) => {
                e.preventDefault();
                clear(i);
              }}
              className={cn(
                "aspect-square rounded-md border text-[10px] font-mono transition-all",
                isDownbeat
                  ? "border-border/80 bg-secondary/40"
                  : "border-border/40 bg-secondary/20",
                degree && DEGREE_COLOR[degree] + " border-transparent text-background shadow-md",
                !degree && "hover:bg-secondary",
                isPlaying && "ring-2 ring-primary/70",
              )}
              title={`Paso ${i + 1}${degree ? ` · grado ${degree}` : " · vacío"}`}
            >
              {degree ?? ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}
