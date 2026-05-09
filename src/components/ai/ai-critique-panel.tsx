"use client";

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  CircleCheck,
  AlertTriangle,
  Info,
  ThumbsUp,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { TrackAnalysis } from "@/lib/audio/track-analysis";
import { cn } from "@/lib/utils";

interface FeedbackItem {
  category: "mix" | "structure" | "sound-design" | "groove" | "arrangement";
  severity: "good" | "info" | "warning" | "issue";
  title: string;
  description: string;
  suggestion: string;
}

interface Critique {
  overallScore: number;
  overallSummary: string;
  strongPoints: string[];
  feedback: FeedbackItem[];
}

const CATEGORY_LABEL: Record<FeedbackItem["category"], string> = {
  mix: "Mezcla",
  structure: "Estructura",
  "sound-design": "Sound design",
  groove: "Groove",
  arrangement: "Arreglo",
};

const SEVERITY_STYLE: Record<FeedbackItem["severity"], string> = {
  good: "border-emerald-500/50 bg-emerald-500/10",
  info: "border-cyan-500/50 bg-cyan-500/10",
  warning: "border-amber-500/50 bg-amber-500/10",
  issue: "border-rose-500/50 bg-rose-500/10",
};

const SEVERITY_ICON: Record<FeedbackItem["severity"], React.ReactNode> = {
  good: <ThumbsUp className="h-4 w-4 text-emerald-400" />,
  info: <Info className="h-4 w-4 text-cyan-400" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-400" />,
  issue: <AlertTriangle className="h-4 w-4 text-rose-400" />,
};

export function AICritiquePanel({
  analysis,
  trackTitle,
  bandLevels,
}: {
  analysis: TrackAnalysis;
  trackTitle?: string;
  bandLevels?: number[];
}) {
  const [loading, setLoading] = useState(false);
  const [critique, setCritique] = useState<Critique | null>(null);

  async function generate() {
    setLoading(true);
    try {
      const energies = analysis.bars.map((b) => b.energy);
      const energyMin = Math.min(...energies);
      const energyMax = Math.max(...energies);

      const sections = analysis.sections.map((s) => ({
        type: s.type,
        lengthBars: s.endBar - s.startBar + 1,
        avgEnergy: s.avgEnergy,
      }));

      const bandSummary = bandLevels && bandLevels.length === 6
        ? {
            sub: bandLevels[0],
            bass: bandLevels[1],
            lowMid: bandLevels[2],
            mid: bandLevels[3],
            highMid: bandLevels[4],
            air: bandLevels[5],
          }
        : undefined;

      const res = await fetch("/api/ai/critique", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          bpm: analysis.bpm,
          durationSec: analysis.durationSec,
          totalBars: analysis.totalBars,
          sections,
          bandSummary,
          energyMin,
          energyMax,
          trackTitle,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "AI failed");
      }
      const data = (await res.json()) as { critique: Critique };
      setCritique(data.critique);
    } catch (e) {
      console.error("[ai/critique] failed", e);
      toast.error("No se pudo generar la crítica");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="font-mono text-xs uppercase tracking-wider text-primary">
            AI Critique
          </h3>
        </div>
        <Button onClick={generate} disabled={loading} size="sm">
          {loading ? (
            <Loader2 className="!h-3 !w-3 animate-spin" />
          ) : (
            <Sparkles className="!h-3 !w-3" />
          )}
          {critique ? "Volver a analizar" : "Analizar mi track"}
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        IA experta en techno revisa BPM, secciones, balance espectral y energía
        — te dice qué funciona y qué mejorar.
      </p>

      {critique && (
        <div className="mt-5 space-y-4">
          {/* Score + summary */}
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-4xl font-bold tabular-nums">
                {critique.overallScore}
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                / 100
              </span>
            </div>
            <p className="mt-2 text-sm">{critique.overallSummary}</p>
          </div>

          {/* Strong points */}
          {critique.strongPoints.length > 0 && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <h4 className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                Lo que está bien
              </h4>
              <ul className="mt-2 space-y-1.5">
                {critique.strongPoints.map((p, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Feedback items */}
          <div className="space-y-2">
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Feedback ({critique.feedback.length})
            </h4>
            {critique.feedback.map((f, i) => (
              <div
                key={i}
                className={cn("rounded-lg border p-4", SEVERITY_STYLE[f.severity])}
              >
                <div className="flex items-center gap-2">
                  {SEVERITY_ICON[f.severity]}
                  <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/80">
                    {CATEGORY_LABEL[f.category]}
                  </span>
                  <span className="text-sm font-semibold">{f.title}</span>
                </div>
                <p className="mt-2 text-sm">{f.description}</p>
                <p className="mt-2 rounded-md bg-background/40 p-2 text-xs">
                  <span className="font-semibold text-foreground">
                    Sugerencia:{" "}
                  </span>
                  {f.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
