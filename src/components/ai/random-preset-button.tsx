"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { SynthState } from "@/lib/audio/synth";

const FAMILIES = [
  { id: "bass", label: "Bass" },
  { id: "pluck", label: "Pluck" },
  { id: "pad", label: "Pad" },
  { id: "lead", label: "Lead" },
  { id: "stab", label: "Stab" },
] as const;

export function RandomPresetButton({
  onApply,
}: {
  onApply: (state: SynthState, description: string) => void;
}) {
  const [loading, setLoading] = useState<string | null>(null);

  async function generate(family: string) {
    setLoading(family);
    try {
      const res = await fetch("/api/ai/preset", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ family }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "AI failed");
      }
      const data = (await res.json()) as {
        preset: SynthState & { description: string };
      };
      const { description, ...state } = data.preset as SynthState & {
        description: string;
      };
      onApply(state, description);
      toast.success("Preset generado por IA", { description });
    } catch (e) {
      console.error("[ai/preset] failed", e);
      toast.error("No se pudo generar el preset", {
        description:
          "Verifica que ANTHROPIC_API_KEY esté configurada en Vercel.",
      });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="font-mono text-xs uppercase tracking-wider text-primary">
          AI Random Preset
        </h3>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        Genera un sonido nuevo con IA en el estilo que pidas. Modifícalo después
        a tu gusto.
      </p>
      <div className="flex flex-wrap gap-2">
        {FAMILIES.map((f) => (
          <Button
            key={f.id}
            size="sm"
            variant="outline"
            disabled={loading !== null}
            onClick={() => generate(f.id)}
          >
            {loading === f.id ? (
              <Loader2 className="!h-3 !w-3 animate-spin" />
            ) : (
              <Sparkles className="!h-3 !w-3" />
            )}
            {f.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
