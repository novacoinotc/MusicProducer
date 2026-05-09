"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Pause, Play, RotateCw, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StepGrid } from "@/components/groove/step-grid";
import { extractPatternFromBar } from "@/lib/audio/pattern-extract";
import { StepSequencer, emptyPattern, type Pattern } from "@/lib/audio/sequencer";
import type { DrumVoice } from "@/lib/audio/drum-kit";

const STORAGE_KEY = "mt:groove-pattern";

export function ExtractedPattern({
  buf,
  startSec,
  bpm,
  sectionLabel,
}: {
  buf: AudioBuffer;
  startSec: number;
  bpm: number;
  sectionLabel: string;
}) {
  const [pattern, setPattern] = useState<Pattern>(() => emptyPattern());
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const seqRef = useRef<StepSequencer | null>(null);

  // Re-extract whenever inputs change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    extractPatternFromBar(buf, startSec, bpm)
      .then((p) => {
        if (!cancelled) setPattern(p);
      })
      .catch((e) => {
        console.error("[extract] failed", e);
        toast.error("No se pudo extraer el patrón");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [buf, startSec, bpm]);

  // Lazy create the local sequencer (separate transport context from main playback)
  useEffect(() => {
    const seq = new StepSequencer();
    seq.setBpm(bpm);
    seq.onStep(setCurrentStep);
    seqRef.current = seq;
    return () => {
      seq.dispose();
      seqRef.current = null;
    };
  }, [bpm]);

  // Push state to engine
  useEffect(() => {
    seqRef.current?.setPattern(pattern);
  }, [pattern]);

  function toggleStep(voice: DrumVoice, step: number) {
    setPattern((prev) => {
      const next = { ...prev, [voice]: [...prev[voice]] };
      next[voice][step] = !next[voice][step];
      return next;
    });
  }

  function togglePlay() {
    const seq = seqRef.current;
    if (!seq) return;
    seq.toggle();
    setIsPlaying(seq.isPlaying());
  }

  function reExtract() {
    setLoading(true);
    extractPatternFromBar(buf, startSec, bpm)
      .then((p) => setPattern(p))
      .catch((e) => {
        console.error("[extract] failed", e);
        toast.error("No se pudo extraer el patrón");
      })
      .finally(() => setLoading(false));
  }

  function sendToGrooveLab() {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ pattern, bpm, source: sectionLabel }),
      );
      toast.success("Patrón enviado al Groove Lab", {
        description: "Abre /groove para editarlo allí.",
      });
    } catch (e) {
      console.error("[extract] storage failed", e);
      toast.error("No se pudo guardar en el navegador");
    }
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-primary">
            patrón extraído · {sectionLabel}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Auto-detectado por análisis de onsets en kick (40-140 Hz),
            clap/snare (250 Hz-1.2 kHz) y hat (&gt; 6 kHz). Ajustable.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            onClick={togglePlay}
            className="h-10 w-10 rounded-full"
            disabled={loading}
            aria-label={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? (
              <Pause className="!h-4 !w-4" />
            ) : (
              <Play className="!h-4 !w-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={reExtract}
            disabled={loading}
          >
            <RotateCw />
            Re-extraer
          </Button>
          <Button size="sm" variant="secondary" onClick={sendToGrooveLab}>
            <Wand2 />
            Enviar al Groove Lab
          </Button>
        </div>
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-lg border bg-card p-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analizando 1 compás de audio…
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-4">
            <StepGrid
              pattern={pattern}
              currentStep={currentStep}
              onToggle={toggleStep}
            />
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Tip: si el BPM detectado es incorrecto, los steps caerán mal. Corrige
        el BPM en el panel de arriba y re-extrae.
      </p>
    </div>
  );
}
