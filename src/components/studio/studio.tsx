"use client";

import { useEffect, useRef, useState } from "react";
import {
  Pause,
  Play,
  Square,
  Download,
  Wand2,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { ensureAudio } from "@/lib/audio/engine";
import {
  StudioEngine,
  emptyMelody,
  type StudioState,
  type Melody,
  KEYS,
} from "@/lib/audio/studio-engine";
import {
  emptyPattern,
  VOICES,
  type Pattern,
} from "@/lib/audio/sequencer";
import type { DrumVoice } from "@/lib/audio/drum-kit";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StepGrid } from "@/components/groove/step-grid";
import { MelodyTrackRow } from "./track-row";
import { cn } from "@/lib/utils";

// Quick demo loop the user can load to hear something immediately.
const DEMO_DRUM: Pattern = (() => {
  const p = emptyPattern();
  [0, 4, 8, 12].forEach((s) => (p.kick[s] = true));
  [4, 12].forEach((s) => (p.clap[s] = true));
  [2, 6, 10, 14].forEach((s) => (p.hat[s] = true));
  return p;
})();

const DEMO_BASS: Melody = [
  1, null, null, null,
  1, null, null, null,
  3, null, null, null,
  5, null, 1, null,
];

const DEMO_LEAD: Melody = [
  null, null, 1, null,
  null, null, 3, null,
  null, null, 5, null,
  null, null, 7, null,
];

export function Studio() {
  const engineRef = useRef<StudioEngine | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [state, setState] = useState<StudioState>(() => ({
    bpm: 124,
    key: "A",
    scale: "minor",
    drum: emptyPattern(),
    bass: emptyMelody(),
    lead: emptyMelody(),
    bassOctave: 2,
    leadOctave: 4,
    drumMute: false,
    bassMute: false,
    leadMute: false,
  }));
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Build engine when audio ready
  useEffect(() => {
    if (!audioReady) return;
    const eng = new StudioEngine(state);
    eng.onStep(setCurrentStep);
    engineRef.current = eng;
    return () => {
      eng.dispose();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioReady]);

  // Push UI state into engine
  useEffect(() => {
    const eng = engineRef.current;
    if (!eng) return;
    eng.setBpm(state.bpm);
    eng.setKey(state.key);
    eng.setScale(state.scale);
    eng.setDrumPattern(state.drum);
    eng.setBassMelody(state.bass);
    eng.setLeadMelody(state.lead);
    eng.setBassOctave(state.bassOctave);
    eng.setLeadOctave(state.leadOctave);
    eng.setMute("drum", state.drumMute);
    eng.setMute("bass", state.bassMute);
    eng.setMute("lead", state.leadMute);
  }, [state]);

  function patch<K extends keyof StudioState>(key: K, value: StudioState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function togglePlay() {
    const eng = engineRef.current;
    if (!eng) return;
    if (isPlaying) {
      eng.stop();
      setIsPlaying(false);
    } else {
      eng.start();
      setIsPlaying(true);
    }
  }

  function loadDemo() {
    setState((prev) => ({
      ...prev,
      drum: DEMO_DRUM,
      bass: DEMO_BASS,
      lead: DEMO_LEAD,
    }));
    toast("Demo cargado — pulsa Play");
  }

  function clearAll() {
    setState((prev) => ({
      ...prev,
      drum: emptyPattern(),
      bass: emptyMelody(),
      lead: emptyMelody(),
    }));
  }

  function toggleDrumStep(voice: DrumVoice, step: number) {
    setState((prev) => {
      const next = { ...prev.drum, [voice]: [...prev.drum[voice]] };
      next[voice][step] = !next[voice][step];
      return { ...prev, drum: next };
    });
  }

  async function handleExport() {
    const eng = engineRef.current;
    if (!eng) return;
    setExporting(true);
    try {
      const blob = await eng.renderToWav(4);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `musictrainer-loop-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Loop exportado", { description: "WAV de 4 compases" });
    } catch (e) {
      console.error("[studio] export failed", e);
      toast.error("Falló la exportación");
    } finally {
      setExporting(false);
    }
  }

  if (!audioReady) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center">
        <Wand2 className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 text-xl font-semibold">Studio Lite</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Mini-DAW dentro del navegador: 3 pistas, sin instalaciones, export a
          WAV.
        </p>
        <Button
          size="lg"
          className="mt-6"
          onClick={async () => {
            await ensureAudio();
            setAudioReady(true);
          }}
        >
          Activar audio y empezar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Master bar */}
      <Card>
        <div className="flex flex-wrap items-center gap-4 p-4">
          <Button
            size="icon"
            onClick={togglePlay}
            className={cn(
              "h-12 w-12 shrink-0 rounded-full",
              isPlaying && "bg-primary/20 text-primary hover:bg-primary/30",
            )}
            variant={isPlaying ? "secondary" : "default"}
          >
            {isPlaying ? (
              <Pause className="!h-5 !w-5" />
            ) : (
              <Play className="!h-5 !w-5" />
            )}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              engineRef.current?.stop();
              setIsPlaying(false);
            }}
          >
            <Square />
          </Button>

          <label className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              BPM
            </span>
            <input
              type="number"
              min={80}
              max={160}
              value={state.bpm}
              onChange={(e) => patch("bpm", Number(e.target.value))}
              className="h-8 w-16 rounded-md border bg-background px-2 text-center font-mono text-sm"
            />
          </label>

          <label className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Key
            </span>
            <select
              value={state.key}
              onChange={(e) =>
                patch("key", e.target.value as StudioState["key"])
              }
              className="h-8 rounded-md border bg-background px-2 text-sm"
            >
              {KEYS.map((k) => (
                <option key={k} value={k}>
                  {k} {state.scale === "minor" ? "min" : state.scale}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Scale
            </span>
            <select
              value={state.scale}
              onChange={(e) =>
                patch("scale", e.target.value as StudioState["scale"])
              }
              className="h-8 rounded-md border bg-background px-2 text-sm"
            >
              <option value="minor">Menor natural</option>
              <option value="dorian">Dórico</option>
              <option value="phrygian">Frigio</option>
            </select>
          </label>

          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={loadDemo}>
              Demo loop
            </Button>
            <Button size="sm" variant="ghost" onClick={clearAll}>
              <RotateCcw />
              Limpiar
            </Button>
            <Button size="sm" onClick={handleExport} disabled={exporting}>
              {exporting ? (
                <Loader2 className="!h-3 !w-3 animate-spin" />
              ) : (
                <Download />
              )}
              Exportar WAV
            </Button>
          </div>
        </div>
      </Card>

      {/* Drums */}
      <div className="rounded-xl border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-foreground">
              Drums
            </span>
            <button
              onClick={() => patch("drumMute", !state.drumMute)}
              className={cn(
                "rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors",
                state.drumMute
                  ? "border-rose-500/60 bg-rose-500/20 text-rose-400"
                  : "border-border text-muted-foreground hover:bg-secondary",
              )}
            >
              {state.drumMute ? "Muted" : "On"}
            </button>
          </div>
        </div>
        <StepGrid
          pattern={state.drum}
          currentStep={currentStep}
          onToggle={toggleDrumStep}
        />
      </div>

      {/* Bass */}
      <MelodyTrackRow
        label="Bass"
        color="bg-rose-500"
        melody={state.bass}
        octave={state.bassOctave}
        onChange={(m) => patch("bass", m)}
        onOctaveChange={(o) => patch("bassOctave", o)}
        muted={state.bassMute}
        onMute={(m) => patch("bassMute", m)}
        currentStep={currentStep}
      />

      {/* Lead */}
      <MelodyTrackRow
        label="Lead"
        color="bg-cyan-400"
        melody={state.lead}
        octave={state.leadOctave}
        onChange={(m) => patch("lead", m)}
        onOctaveChange={(o) => patch("leadOctave", o)}
        muted={state.leadMute}
        onMute={(m) => patch("leadMute", m)}
        currentStep={currentStep}
      />

      <div className="rounded-md border bg-card p-3 text-xs text-muted-foreground">
        <strong className="text-foreground">Cómo se usa:</strong> En las pistas
        melódicas (Bass / Lead), <em>click</em> en una celda cicla por los 7
        grados de la escala (1 = tónica, 3 = tercera, etc). <em>Click derecho</em>{" "}
        limpia la celda. Cambia Key/Scale arriba para transponer todo el loop.
      </div>
    </div>
  );
}
