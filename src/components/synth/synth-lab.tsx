"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Lightbulb, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { ensureAudio } from "@/lib/audio/engine";
import {
  TechnoSynth,
  DEFAULT_SYNTH,
  type SynthState,
  type OscType,
  type FilterType,
  type LfoTarget,
} from "@/lib/audio/synth";
import { SYNTH_PRESETS, type SynthPreset } from "@/lib/synth-presets";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Knob } from "./knob";
import { SelectPill } from "./select-pill";
import { Keyboard } from "./keyboard";
import { cn } from "@/lib/utils";

const OSC_OPTIONS = [
  { value: "sawtooth" as OscType, label: "Saw" },
  { value: "square" as OscType, label: "Sqr" },
  { value: "triangle" as OscType, label: "Tri" },
  { value: "sine" as OscType, label: "Sin" },
];

const FILTER_OPTIONS = [
  { value: "lowpass" as FilterType, label: "LP" },
  { value: "highpass" as FilterType, label: "HP" },
  { value: "bandpass" as FilterType, label: "BP" },
];

const LFO_OPTIONS = [
  { value: "off" as LfoTarget, label: "Off" },
  { value: "filter" as LfoTarget, label: "Filter" },
  { value: "amp" as LfoTarget, label: "Amp" },
];

export function SynthLab() {
  const synthRef = useRef<TechnoSynth | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [state, setState] = useState<SynthState>(DEFAULT_SYNTH);
  const [activePreset, setActivePreset] = useState<SynthPreset | null>(null);
  const [challenge, setChallenge] = useState<SynthPreset | null>(null);
  const [showHint, setShowHint] = useState(false);

  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    if (!audioReady) return;
    let s: TechnoSynth | null = null;
    try {
      s = new TechnoSynth();
      synthRef.current = s;
      s.set(state);
    } catch (e) {
      console.error("[synth] init failed", e);
      setInitError(e instanceof Error ? e.message : String(e));
      return;
    }
    return () => {
      s?.dispose();
      synthRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioReady]);

  function update(patch: Partial<SynthState>) {
    setState((prev) => {
      const next = { ...prev, ...patch };
      synthRef.current?.set(patch);
      return next;
    });
  }

  function loadPreset(p: SynthPreset) {
    setState(p.state);
    synthRef.current?.set(p.state);
    setActivePreset(p);
    toast(`Cargado: ${p.name}`, { description: p.inspiration });
  }

  function startChallenge(p: SynthPreset) {
    setChallenge(p);
    setActivePreset(null);
    setShowHint(false);
    setState(DEFAULT_SYNTH);
    synthRef.current?.set(DEFAULT_SYNTH);
    toast(`Reto: imita el preset "${p.name}"`, {
      description: p.inspiration,
    });
  }

  function previewChallenge() {
    if (!challenge) return;
    const original = state;
    synthRef.current?.set(challenge.state);
    synthRef.current?.noteOn("C3");
    setTimeout(() => {
      synthRef.current?.noteOff("C3");
      synthRef.current?.set(original);
    }, 900);
  }

  if (!audioReady) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center">
        <Wand2 className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 text-xl font-semibold">Activa el audio</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          El sintetizador necesita un click para empezar a sonar.
        </p>
        <Button
          size="lg"
          className="mt-6"
          onClick={async () => {
            try {
              await ensureAudio();
              setAudioReady(true);
            } catch (e) {
              console.error("[synth] ensureAudio failed", e);
              setInitError(e instanceof Error ? e.message : String(e));
            }
          }}
        >
          Activar audio
        </Button>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6">
        <h2 className="text-lg font-semibold text-destructive">
          No se pudo inicializar el sintetizador
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {initError}
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          Tu navegador puede no soportar todas las funciones de Web Audio.
          Prueba con Chrome o Firefox actualizados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Synth panel */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>Synth</CardTitle>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {activePreset ? `Preset · ${activePreset.name}` : "Custom"}
            </span>
          </div>
        </CardHeader>
        <div className="grid gap-4 p-6 pt-0 lg:grid-cols-4">
          <Section title="OSC 1">
            <SelectPill
              label="Wave"
              value={state.osc1Type}
              options={OSC_OPTIONS}
              onChange={(v) => update({ osc1Type: v })}
            />
          </Section>

          <Section title="OSC 2">
            <SelectPill
              label="Wave"
              value={state.osc2Type}
              options={OSC_OPTIONS}
              onChange={(v) => update({ osc2Type: v })}
            />
            <Knob
              label="Detune"
              value={state.osc2Detune}
              min={-1200}
              max={1200}
              step={1}
              onChange={(v) => update({ osc2Detune: v })}
              format={(v) => `${v.toFixed(0)}c`}
            />
            <Knob
              label="Mix"
              value={state.osc2Mix}
              min={0}
              max={1}
              onChange={(v) => update({ osc2Mix: v })}
              format={(v) => `${(v * 100).toFixed(0)}%`}
            />
            <Knob
              label="Sub"
              value={state.subLevel}
              min={0}
              max={1}
              onChange={(v) => update({ subLevel: v })}
              format={(v) => `${(v * 100).toFixed(0)}%`}
            />
          </Section>

          <Section title="Filter">
            <SelectPill
              label="Type"
              value={state.filterType}
              options={FILTER_OPTIONS}
              onChange={(v) => update({ filterType: v })}
            />
            <Knob
              label="Cutoff"
              value={state.filterCutoff}
              min={80}
              max={12000}
              step={1}
              onChange={(v) => update({ filterCutoff: v })}
              format={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v.toFixed(0)}Hz`
              }
            />
            <Knob
              label="Resonance"
              value={state.filterRes}
              min={0}
              max={20}
              step={0.1}
              onChange={(v) => update({ filterRes: v })}
              format={(v) => v.toFixed(1)}
            />
            <Knob
              label="Env amount"
              value={state.filterEnvAmount}
              min={0}
              max={1}
              onChange={(v) => update({ filterEnvAmount: v })}
              format={(v) => `${(v * 100).toFixed(0)}%`}
            />
          </Section>

          <Section title="Amp envelope">
            <Knob
              label="Attack"
              value={state.ampAttack}
              min={0.001}
              max={4}
              step={0.001}
              onChange={(v) => update({ ampAttack: v })}
              format={(v) => `${(v * 1000).toFixed(0)}ms`}
            />
            <Knob
              label="Decay"
              value={state.ampDecay}
              min={0.01}
              max={4}
              step={0.01}
              onChange={(v) => update({ ampDecay: v })}
              format={(v) => `${(v * 1000).toFixed(0)}ms`}
            />
            <Knob
              label="Sustain"
              value={state.ampSustain}
              min={0}
              max={1}
              onChange={(v) => update({ ampSustain: v })}
              format={(v) => `${(v * 100).toFixed(0)}%`}
            />
            <Knob
              label="Release"
              value={state.ampRelease}
              min={0.01}
              max={6}
              step={0.01}
              onChange={(v) => update({ ampRelease: v })}
              format={(v) =>
                v >= 1 ? `${v.toFixed(1)}s` : `${(v * 1000).toFixed(0)}ms`
              }
            />
          </Section>

          <Section title="Filter envelope">
            <Knob
              label="Attack"
              value={state.filterAttack}
              min={0.001}
              max={4}
              step={0.001}
              onChange={(v) => update({ filterAttack: v })}
              format={(v) => `${(v * 1000).toFixed(0)}ms`}
            />
            <Knob
              label="Decay"
              value={state.filterDecay}
              min={0.01}
              max={4}
              step={0.01}
              onChange={(v) => update({ filterDecay: v })}
              format={(v) => `${(v * 1000).toFixed(0)}ms`}
            />
            <Knob
              label="Sustain"
              value={state.filterSustain}
              min={0}
              max={1}
              onChange={(v) => update({ filterSustain: v })}
              format={(v) => `${(v * 100).toFixed(0)}%`}
            />
            <Knob
              label="Release"
              value={state.filterRelease}
              min={0.01}
              max={6}
              step={0.01}
              onChange={(v) => update({ filterRelease: v })}
              format={(v) =>
                v >= 1 ? `${v.toFixed(1)}s` : `${(v * 1000).toFixed(0)}ms`
              }
            />
          </Section>

          <Section title="LFO">
            <SelectPill
              label="Target"
              value={state.lfoTarget}
              options={LFO_OPTIONS}
              onChange={(v) => update({ lfoTarget: v })}
            />
            <Knob
              label="Rate"
              value={state.lfoRate}
              min={0.05}
              max={20}
              step={0.01}
              onChange={(v) => update({ lfoRate: v })}
              format={(v) => `${v.toFixed(2)}Hz`}
            />
            <Knob
              label="Depth"
              value={state.lfoDepth}
              min={0}
              max={1}
              onChange={(v) => update({ lfoDepth: v })}
              format={(v) => `${(v * 100).toFixed(0)}%`}
            />
          </Section>

          <Section title="FX">
            <Knob
              label="Drive"
              value={state.drive}
              min={0}
              max={1}
              onChange={(v) => update({ drive: v })}
              format={(v) => `${(v * 100).toFixed(0)}%`}
            />
            <Knob
              label="Delay mix"
              value={state.delayMix}
              min={0}
              max={0.7}
              onChange={(v) => update({ delayMix: v })}
              format={(v) => `${(v * 100).toFixed(0)}%`}
            />
            <Knob
              label="Delay time"
              value={state.delayTime}
              min={0.05}
              max={1}
              step={0.01}
              onChange={(v) => update({ delayTime: v })}
              format={(v) => `${(v * 1000).toFixed(0)}ms`}
            />
            <Knob
              label="Reverb mix"
              value={state.reverbMix}
              min={0}
              max={0.9}
              onChange={(v) => update({ reverbMix: v })}
              format={(v) => `${(v * 100).toFixed(0)}%`}
            />
          </Section>

          <Section title="Output">
            <Knob
              label="Volume"
              value={state.volume}
              min={-40}
              max={6}
              step={0.5}
              onChange={(v) => update({ volume: v })}
              format={(v) => `${v.toFixed(1)}dB`}
            />
          </Section>
        </div>
      </Card>

      {/* Keyboard */}
      <Keyboard
        onNoteOn={(n) => synthRef.current?.noteOn(n)}
        onNoteOff={(n) => synthRef.current?.noteOff(n)}
      />

      {/* Presets */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Presets de melodic techno
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {SYNTH_PRESETS.map((p) => (
            <PresetCard
              key={p.id}
              preset={p}
              active={activePreset?.id === p.id}
              onLoad={() => loadPreset(p)}
              onChallenge={() => startChallenge(p)}
            />
          ))}
        </div>
      </div>

      {/* Challenge banner */}
      {challenge && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-primary">
                Reto activo · imitar
              </p>
              <h3 className="mt-1 text-lg font-semibold">{challenge.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {challenge.description}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={previewChallenge}>
                Escuchar referencia
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowHint((s) => !s)}
              >
                <Lightbulb />
                {showHint ? "Ocultar pista" : "Pista"}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => loadPreset(challenge)}>
                Mostrar solución
              </Button>
            </div>
          </div>
          {showHint && (
            <p className="mt-3 rounded-md bg-background/50 p-3 text-sm">
              <span className="font-mono text-xs uppercase tracking-wider text-primary">
                Pista —{" "}
              </span>
              {challenge.hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-secondary/20 p-3">
      <h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-foreground/70">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function PresetCard({
  preset,
  active,
  onLoad,
  onChallenge,
}: {
  preset: SynthPreset;
  active: boolean;
  onLoad: () => void;
  onChallenge: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 transition-colors",
        active && "border-primary/60 bg-primary/5",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
          {preset.family}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {preset.inspiration}
        </span>
      </div>
      <h3 className="mt-2 font-medium">{preset.name}</h3>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
        {preset.description}
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="outline" className="flex-1" onClick={onLoad}>
          Cargar
        </Button>
        <Button size="sm" className="flex-1" onClick={onChallenge}>
          Reto
        </Button>
      </div>
    </div>
  );
}
