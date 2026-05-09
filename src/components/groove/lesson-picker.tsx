"use client";

import { cn } from "@/lib/utils";
import { GROOVE_LESSONS, type GrooveLesson } from "@/lib/groove-presets";

const DIFF_COLOR = {
  Básico: "text-emerald-400",
  Intermedio: "text-amber-400",
  Avanzado: "text-rose-400",
} as const;

export function LessonPicker({
  activeId,
  onPick,
}: {
  activeId: string | null;
  onPick: (l: GrooveLesson) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {GROOVE_LESSONS.map((l) => {
        const active = activeId === l.id;
        return (
          <button
            key={l.id}
            onClick={() => onPick(l)}
            className={cn(
              "group rounded-lg border bg-card p-4 text-left transition-colors hover:border-primary/40",
              active && "border-primary/60 bg-primary/5",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "font-mono text-[10px] uppercase tracking-wider",
                  DIFF_COLOR[l.difficulty],
                )}
              >
                {l.difficulty}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                {l.bpm} BPM
              </span>
            </div>
            <h3 className="mt-2 font-medium">{l.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {l.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
