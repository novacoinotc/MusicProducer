"use client";

import { useEffect, useState } from "react";
import { Check, Headphones, RotateCw, Volume2, X } from "lucide-react";
import { ensureAudio } from "@/lib/audio/engine";
import {
  playSequence,
  playProgression,
} from "@/lib/audio/piano";
import {
  generateIntervalQuestion,
  generateScaleQuestion,
  generateProgressionQuestion,
  type EarQuestion,
} from "@/lib/ear-training";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Mode = "interval" | "scale" | "progression";

const MODES: { id: Mode; label: string; description: string }[] = [
  {
    id: "interval",
    label: "Intervalos",
    description: "Identifica la distancia entre dos notas.",
  },
  {
    id: "scale",
    label: "Escalas",
    description: "Reconoce el modo (menor, dórica, frigia...).",
  },
  {
    id: "progression",
    label: "Progresiones",
    description: "Identifica progresiones típicas de melodic techno.",
  },
];

function generate(mode: Mode): EarQuestion {
  if (mode === "interval") return generateIntervalQuestion();
  if (mode === "scale") return generateScaleQuestion();
  return generateProgressionQuestion();
}

export function EarTrainer() {
  const [audioReady, setAudioReady] = useState(false);
  const [mode, setMode] = useState<Mode>("interval");
  const [q, setQ] = useState<EarQuestion | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    if (!audioReady) return;
    setQ(generate(mode));
    setPicked(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioReady, mode]);

  function play() {
    if (!q) return;
    if (q.kind === "interval") playSequence(q.notes, 0.7, 0.05);
    else if (q.kind === "scale") playSequence(q.notes, 0.32, 0);
    else playProgression(q.chords, 1.1);
  }

  function next() {
    setQ(generate(mode));
    setPicked(null);
  }

  function answer(value: string) {
    if (!q || picked) return;
    setPicked(value);
    const correct = value === q.answer;
    if (correct) {
      setStreak((s) => {
        const n = s + 1;
        setBest((b) => Math.max(b, n));
        return n;
      });
    } else {
      setStreak(0);
    }
  }

  if (!audioReady) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center">
        <Headphones className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 text-xl font-semibold">Listo para escuchar</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Pondremos a prueba tu oído con intervalos, escalas y progresiones.
        </p>
        <Button
          size="lg"
          className="mt-6"
          onClick={async () => {
            await ensureAudio();
            setAudioReady(true);
          }}
        >
          Activar audio
        </Button>
      </div>
    );
  }

  if (!q) return null;
  const correctValue = q.answer;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-card p-4">
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "rounded-md border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors",
                mode === m.id
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:bg-secondary",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Racha
            </span>
            <span className="font-mono text-lg tabular-nums">{streak}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Mejor
            </span>
            <span className="font-mono text-lg tabular-nums text-primary">
              {best}
            </span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {MODES.find((m) => m.id === mode)?.label}
            <span className="text-sm font-normal text-muted-foreground">
              · {MODES.find((m) => m.id === mode)?.description}
            </span>
          </CardTitle>
        </CardHeader>
        <div className="flex flex-col items-center gap-6 p-6 pt-0">
          {q.kind === "progression" && (
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Tonalidad: {q.key}
            </p>
          )}
          <Button size="lg" onClick={play} className="h-16 w-16 rounded-full">
            <Volume2 className="!h-7 !w-7" />
          </Button>
          <p className="text-sm text-muted-foreground">
            Pulsa para escuchar las veces que quieras.
          </p>

          <div className="grid w-full gap-2 sm:grid-cols-2">
            {q.options.map((opt) => {
              const isPicked = picked === opt.value;
              const isCorrect = opt.value === correctValue;
              const reveal = picked !== null;
              return (
                <button
                  key={opt.value}
                  disabled={picked !== null}
                  onClick={() => answer(opt.value)}
                  className={cn(
                    "flex items-center justify-between rounded-md border bg-secondary/20 px-4 py-3 text-left text-sm transition-colors disabled:cursor-default",
                    !reveal && "hover:bg-secondary",
                    reveal && isCorrect && "border-emerald-500/60 bg-emerald-500/10",
                    reveal &&
                      isPicked &&
                      !isCorrect &&
                      "border-rose-500/60 bg-rose-500/10",
                  )}
                >
                  <span>{opt.label}</span>
                  {reveal && isCorrect && (
                    <Check className="h-4 w-4 text-emerald-400" />
                  )}
                  {reveal && isPicked && !isCorrect && (
                    <X className="h-4 w-4 text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>

          {picked && (
            <div className="flex w-full items-center justify-between gap-3 rounded-md border bg-background/50 p-3 text-sm">
              <span>
                {picked === correctValue
                  ? "¡Correcto! 🎯"
                  : `La respuesta era: ${q.options.find((o) => o.value === correctValue)?.label}`}
              </span>
              <Button size="sm" onClick={next}>
                <RotateCw />
                Siguiente
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
