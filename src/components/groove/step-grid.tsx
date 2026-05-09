"use client";

import { cn } from "@/lib/utils";
import type { Pattern } from "@/lib/audio/sequencer";
import { VOICES } from "@/lib/audio/sequencer";
import type { DrumVoice } from "@/lib/audio/drum-kit";

const VOICE_LABEL: Record<DrumVoice, string> = {
  kick: "Kick",
  clap: "Clap",
  ohat: "Open hat",
  hat: "Hat",
  perc: "Perc",
  rim: "Rim",
};

const VOICE_COLOR: Record<DrumVoice, string> = {
  kick: "bg-rose-500",
  clap: "bg-amber-400",
  ohat: "bg-cyan-400",
  hat: "bg-emerald-400",
  perc: "bg-violet-400",
  rim: "bg-fuchsia-400",
};

export function StepGrid({
  pattern,
  currentStep,
  onToggle,
}: {
  pattern: Pattern;
  currentStep: number;
  onToggle: (voice: DrumVoice, step: number) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px] space-y-1.5">
        {/* Step indicators (1..16) */}
        <div className="grid grid-cols-[80px_repeat(16,minmax(0,1fr))] gap-1 pl-1">
          <div />
          {Array.from({ length: 16 }).map((_, i) => {
            const beat = Math.floor(i / 4) + 1;
            const isDownbeat = i % 4 === 0;
            const isPlaying = currentStep === i;
            return (
              <div
                key={i}
                className={cn(
                  "text-center font-mono text-[10px] tabular-nums transition-colors",
                  isDownbeat ? "text-foreground" : "text-muted-foreground/60",
                  isPlaying && "text-primary",
                )}
              >
                {isDownbeat ? beat : ""}
              </div>
            );
          })}
        </div>

        {VOICES.map((voice) => (
          <div
            key={voice}
            className="grid grid-cols-[80px_repeat(16,minmax(0,1fr))] items-center gap-1"
          >
            <div className="flex items-center gap-2 pr-2">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  VOICE_COLOR[voice],
                )}
              />
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {VOICE_LABEL[voice]}
              </span>
            </div>
            {pattern[voice].map((on, step) => {
              const isDownbeat = step % 4 === 0;
              const isPlaying = currentStep === step;
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => onToggle(voice, step)}
                  aria-label={`${VOICE_LABEL[voice]} paso ${step + 1}`}
                  aria-pressed={on}
                  className={cn(
                    "aspect-square rounded-md border transition-all duration-75",
                    isDownbeat
                      ? "border-border/80 bg-secondary/40"
                      : "border-border/40 bg-secondary/20",
                    on
                      ? `${VOICE_COLOR[voice]} border-transparent shadow-md`
                      : "hover:bg-secondary",
                    isPlaying &&
                      "ring-2 ring-primary/70 ring-offset-1 ring-offset-background",
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
