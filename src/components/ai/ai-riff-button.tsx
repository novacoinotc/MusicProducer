"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AIRiffButton({
  bpm,
  onApply,
}: {
  bpm: number;
  onApply: (notes: string[], description: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState("A minor");
  const [style, setStyle] = useState<
    "melodic" | "hypnotic" | "progressive" | "peak-time"
  >("melodic");

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/riff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key, style, bpm }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "AI failed");
      }
      const data = (await res.json()) as {
        riff: { notes: string[]; description: string };
      };
      onApply(data.riff.notes, data.riff.description);
      toast.success("Riff generado por IA", {
        description: data.riff.description,
      });
    } catch (e) {
      console.error("[ai/riff] failed", e);
      toast.error("No se pudo generar el riff");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
          AI Riff Generator
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="h-7 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {[
            "A minor",
            "C minor",
            "D minor",
            "E minor",
            "F minor",
            "G minor",
          ].map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <select
          value={style}
          onChange={(e) =>
            setStyle(
              e.target.value as
                | "melodic"
                | "hypnotic"
                | "progressive"
                | "peak-time",
            )
          }
          className="h-7 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="melodic">Melodic</option>
          <option value="hypnotic">Hypnotic</option>
          <option value="progressive">Progressive</option>
          <option value="peak-time">Peak-time</option>
        </select>
        <Button size="sm" onClick={generate} disabled={loading}>
          {loading ? (
            <Loader2 className="!h-3 !w-3 animate-spin" />
          ) : (
            <Sparkles className="!h-3 !w-3" />
          )}
          Generar riff
        </Button>
      </div>
    </div>
  );
}
