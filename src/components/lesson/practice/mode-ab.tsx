"use client";

import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ensureAudio } from "@/lib/audio/engine";
import { cn } from "@/lib/utils";

const MAJOR = [["C3", "E3", "G3"], ["F3", "A3", "C4"], ["G3", "B3", "D4"], ["C3", "E3", "G3"]];
const MINOR = [["C3", "Eb3", "G3"], ["Ab2", "C3", "Eb3"], ["Bb2", "D3", "F3"], ["C3", "Eb3", "G3"]];

export default function ModeAB() {
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const [playing, setPlaying] = useState<"major" | "minor" | null>(null);

  useEffect(() => {
    return () => {
      synthRef.current?.dispose();
    };
  }, []);

  async function play(mode: "major" | "minor") {
    await ensureAudio();
    if (!synthRef.current) {
      synthRef.current = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.05, decay: 0.4, sustain: 0.5, release: 1.0 },
        volume: -12,
      }).toDestination();
    }
    setPlaying(mode);
    const chords = mode === "major" ? MAJOR : MINOR;
    const start = Tone.now() + 0.05;
    chords.forEach((chord, i) => {
      synthRef.current?.triggerAttackRelease(chord, "1n", start + i * 1.0);
    });
    setTimeout(() => setPlaying(null), 4500);
  }

  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="mb-4 text-sm text-muted-foreground">
        Misma raíz (C), distinto modo. Pulsa cada uno varias veces hasta que sientas la diferencia.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          size="lg"
          variant={playing === "major" ? "default" : "outline"}
          onClick={() => play("major")}
          className={cn("h-auto flex-col gap-2 py-6", playing === "major" && "bg-amber-500/30 hover:bg-amber-500/40")}
        >
          <Volume2 className="!h-6 !w-6" />
          <div>
            <div className="text-base font-semibold">C mayor</div>
            <div className="font-mono text-[10px] uppercase tracking-wider opacity-70">brillante · feliz</div>
          </div>
        </Button>
        <Button
          size="lg"
          variant={playing === "minor" ? "default" : "outline"}
          onClick={() => play("minor")}
          className={cn("h-auto flex-col gap-2 py-6", playing === "minor" && "bg-cyan-500/30 hover:bg-cyan-500/40")}
        >
          <Volume2 className="!h-6 !w-6" />
          <div>
            <div className="text-base font-semibold">C menor</div>
            <div className="font-mono text-[10px] uppercase tracking-wider opacity-70">oscuro · emocional</div>
          </div>
        </Button>
      </div>
    </div>
  );
}
