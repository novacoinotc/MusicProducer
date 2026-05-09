"use client";

import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { ensureAudio } from "@/lib/audio/engine";
import { cn } from "@/lib/utils";

const OCTAVES = [2, 3, 4, 5];

export default function OctaveKeys() {
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      synthRef.current?.dispose();
    };
  }, []);

  async function play(note: string) {
    await ensureAudio();
    if (!synthRef.current) {
      synthRef.current = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.6 },
        volume: -10,
      }).toDestination();
    }
    setActive(note);
    synthRef.current.triggerAttackRelease(note, "1n");
    setTimeout(() => setActive(null), 600);
  }

  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="mb-3 text-sm text-muted-foreground">
        Toca C en distintas octavas. La nota es la misma — solo cambia la octava.
      </p>
      <div className="grid grid-cols-4 gap-2">
        {OCTAVES.map((oct) => {
          const note = `C${oct}`;
          return (
            <button
              key={oct}
              onClick={() => play(note)}
              className={cn(
                "rounded-lg border bg-secondary/20 p-4 text-center transition-all hover:bg-secondary",
                active === note && "border-primary/60 bg-primary/20 scale-105",
              )}
            >
              <div className="font-mono text-2xl font-bold">{note}</div>
              <div className="font-mono text-[10px] text-muted-foreground">
                {Math.round(440 * Math.pow(2, (oct - 4) - (9 / 12)))} Hz
              </div>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Cada vez que subes una octava, la frecuencia se duplica. C2 ≈ 65 Hz, C3 ≈ 130 Hz, C4 ≈ 261 Hz, C5 ≈ 523 Hz.
      </p>
    </div>
  );
}
