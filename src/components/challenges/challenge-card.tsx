"use client";

import { useState } from "react";
import { Check, Circle, Trophy } from "lucide-react";
import type { WeeklyChallenge } from "@/lib/challenges";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DIFF_COLOR = {
  Básico: "text-emerald-400",
  Intermedio: "text-amber-400",
  Avanzado: "text-rose-400",
} as const;

export function ChallengeCard({
  challenge,
  active,
}: {
  challenge: WeeklyChallenge;
  active?: boolean;
}) {
  const [done, setDone] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setDone((prev) => {
      const n = new Set(prev);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  }

  const completed = done.size === challenge.checklist.length;

  return (
    <Card className={cn(active && "border-primary/40")}>
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
            {challenge.weekLabel}
          </span>
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-wider",
              DIFF_COLOR[challenge.difficulty],
            )}
          >
            {challenge.difficulty}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-semibold">{challenge.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Referencia · {challenge.reference}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="BPM" value={`${challenge.bpm}`} />
          <Stat label="Tonalidad" value={challenge.key} />
          <Stat label="Progreso" value={`${done.size}/${challenge.checklist.length}`} />
        </div>

        <p className="rounded-md bg-secondary/30 p-3 text-sm">
          <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
            Brief —{" "}
          </span>
          {challenge.brief}
        </p>

        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Checklist
          </h4>
          <ul className="mt-2 space-y-1.5">
            {challenge.checklist.map((item, i) => {
              const isDone = done.has(i);
              return (
                <li key={i}>
                  <button
                    onClick={() => toggle(i)}
                    className={cn(
                      "flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary/50",
                      isDone && "text-muted-foreground line-through",
                    )}
                  >
                    {isDone ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span>{item}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {completed && (
          <div className="flex items-center gap-3 rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm">
            <Trophy className="h-5 w-5 text-emerald-400" />
            <span>¡Reto completo! Súbelo a SoundCloud o Bandcamp y compárteselo a alguien.</span>
          </div>
        )}

        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <a href="/groove">Ir al Groove Lab</a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href="/synth">Ir al Synth Lab</a>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-secondary/20 p-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-mono text-sm tabular-nums">{value}</p>
    </div>
  );
}
