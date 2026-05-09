"use client";

import { useEffect, useRef, useState } from "react";
import { Lightbulb, Music2 } from "lucide-react";
import { toast } from "sonner";
import { ensureAudio } from "@/lib/audio/engine";
import {
  StepSequencer,
  emptyPattern,
  type Pattern,
} from "@/lib/audio/sequencer";
import type { DrumVoice } from "@/lib/audio/drum-kit";
import {
  GROOVE_LESSONS,
  type GrooveLesson,
} from "@/lib/groove-presets";
import { StepGrid } from "./step-grid";
import { TransportBar } from "./transport-bar";
import { LessonPicker } from "./lesson-picker";
import { Button } from "@/components/ui/button";

export function GrooveLab() {
  const seqRef = useRef<StepSequencer | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [pattern, setPattern] = useState<Pattern>(() => emptyPattern());
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(126);
  const [swing, setSwing] = useState(0);
  const [volume, setVolume] = useState(-3);
  const [lesson, setLesson] = useState<GrooveLesson | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/groove/complete")
      .then((r) => r.json())
      .then((d) => setCompleted(new Set<string>(d.completed ?? [])))
      .catch(() => {});
  }, []);

  // Lazy-create sequencer once audio is ready
  useEffect(() => {
    if (!audioReady) return;
    const seq = new StepSequencer();
    seq.setBpm(bpm);
    seq.setSwing(swing);
    seq.setVolume(volume);
    seq.onStep(setCurrentStep);
    seqRef.current = seq;
    return () => {
      seq.dispose();
      seqRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioReady]);

  // Push state changes into the engine
  useEffect(() => {
    seqRef.current?.setPattern(pattern);
  }, [pattern]);
  useEffect(() => {
    seqRef.current?.setBpm(bpm);
  }, [bpm]);
  useEffect(() => {
    seqRef.current?.setSwing(swing);
  }, [swing]);
  useEffect(() => {
    seqRef.current?.setVolume(volume);
  }, [volume]);

  async function handleStart() {
    await ensureAudio();
    setAudioReady(true);
  }

  function handleToggle() {
    const seq = seqRef.current;
    if (!seq) return;
    seq.toggle();
    setIsPlaying(seq.isPlaying());
  }

  function handleClear() {
    setPattern(emptyPattern());
    setLesson(null);
    setShowHint(false);
    toast("Patrón limpio.");
  }

  function handleToggleStep(voice: DrumVoice, step: number) {
    setPattern((prev) => {
      const next = { ...prev, [voice]: [...prev[voice]] };
      next[voice][step] = !next[voice][step];
      return next;
    });
  }

  function handlePickLesson(l: GrooveLesson) {
    setLesson(l);
    setShowHint(false);
    setBpm(l.bpm);
    setSwing(l.swing);
    setPattern(emptyPattern());
    toast(`Reto: ${l.title}`, { description: l.description });
  }

  function loadLessonAnswer() {
    if (!lesson) return;
    setPattern(lesson.pattern);
    toast.success("Patrón de referencia cargado. Escúchalo y compáralo con tu intento.");
    if (!completed.has(lesson.id)) {
      const next = new Set(completed);
      next.add(lesson.id);
      setCompleted(next);
      fetch("/api/groove/complete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id }),
      }).catch(() => {});
    }
  }

  if (!audioReady) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center">
        <Music2 className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 text-xl font-semibold">
          Listo para hacer techno?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          El navegador necesita un toque tuyo para empezar a sonar.
        </p>
        <div className="mt-6">
          <Button size="lg" onClick={handleStart}>
            Activar audio y empezar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TransportBar
        isPlaying={isPlaying}
        onToggle={handleToggle}
        onClear={handleClear}
        bpm={bpm}
        onBpmChange={setBpm}
        swing={swing}
        onSwingChange={setSwing}
        volume={volume}
        onVolumeChange={setVolume}
      />

      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <StepGrid
          pattern={pattern}
          currentStep={currentStep}
          onToggle={handleToggleStep}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Retos de groove
          </h2>
          <span className="font-mono text-[10px] text-muted-foreground">
            {GROOVE_LESSONS.length} lecciones
          </span>
        </div>
        <LessonPicker
          activeId={lesson?.id ?? null}
          completed={completed}
          onPick={handlePickLesson}
        />
      </div>

      {lesson && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-primary">
                Reto activo
              </p>
              <h3 className="mt-1 text-lg font-semibold">{lesson.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {lesson.description}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowHint((s) => !s)}
              >
                <Lightbulb />
                {showHint ? "Ocultar pista" : "Pista"}
              </Button>
              <Button size="sm" variant="secondary" onClick={loadLessonAnswer}>
                Mostrar solución
              </Button>
            </div>
          </div>
          {showHint && (
            <p className="mt-3 rounded-md bg-background/50 p-3 text-sm">
              <span className="font-mono text-xs uppercase tracking-wider text-primary">
                Pista —{" "}
              </span>
              {lesson.hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
