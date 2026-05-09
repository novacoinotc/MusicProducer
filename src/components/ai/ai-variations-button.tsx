"use client";

import { useState } from "react";
import { Sparkles, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Pattern } from "@/lib/audio/sequencer";

interface Variation {
  label: string;
  pattern: Pattern;
}

export function AIVariationsButton({
  pattern,
  onApply,
}: {
  pattern: Pattern;
  onApply: (pattern: Pattern, label: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState<Variation[] | null>(null);

  async function generate() {
    setLoading(true);
    setVariations(null);
    try {
      const res = await fetch("/api/ai/variation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pattern, style: "melodic" }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "AI failed");
      }
      const data = (await res.json()) as { variations: Variation[] };
      setVariations(data.variations);
    } catch (e) {
      console.error("[ai/variation] failed", e);
      toast.error("No se pudo generar variaciones");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="font-mono text-xs uppercase tracking-wider text-primary">
          AI Variaciones del patrón
        </h3>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        Genera 3 variaciones de tu groove actual. Para cuando te bloqueas con
        ‘qué cambio meto en este compás’.
      </p>

      {!variations ? (
        <Button onClick={generate} disabled={loading} size="sm">
          {loading ? (
            <Loader2 className="!h-3 !w-3 animate-spin" />
          ) : (
            <Sparkles className="!h-3 !w-3" />
          )}
          {loading ? "Generando…" : "Generar 3 variaciones"}
        </Button>
      ) : (
        <div className="space-y-2">
          {variations.map((v, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 rounded-md border bg-background/50 p-3 text-sm"
            >
              <span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-primary mr-2">
                  V{i + 1}
                </span>
                {v.label}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onApply(v.pattern, v.label);
                  toast.success(`Variación cargada: ${v.label}`);
                }}
              >
                <Check className="!h-3 !w-3" />
                Cargar
              </Button>
            </div>
          ))}
          <Button size="sm" variant="ghost" onClick={generate}>
            Generar otras 3
          </Button>
        </div>
      )}
    </div>
  );
}
