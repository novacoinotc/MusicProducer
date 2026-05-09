"use client";

import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ensureAudio } from "@/lib/audio/engine";

const PROGRESSIONS: Record<
  string,
  { label: string; description: string; chords: string[][] }[]
> = {
  "i-VI-III-VII": [
    {
      label: "i-VI-III-VII en A menor",
      description: "Am · F · C · G — la progresión épica del melodic techno.",
      chords: [
        ["A2", "C3", "E3"],
        ["F2", "A2", "C3"],
        ["C3", "E3", "G3"],
        ["G2", "B2", "D3"],
      ],
    },
  ],
  dorian: [
    {
      label: "Menor natural en C",
      description: "C · Eb · F · G · Ab — sabor oscuro estándar.",
      chords: [["C3", "Eb3", "G3"], ["F3", "Ab3", "C4"], ["G3", "Bb3", "D4"], ["C3", "Eb3", "G3"]],
    },
    {
      label: "Dórico en C",
      description: "C · Eb · F · G · A (¡la 6ª subida!) — un toque más brillante.",
      chords: [["C3", "Eb3", "G3"], ["F3", "A3", "C4"], ["G3", "Bb3", "D4"], ["C3", "Eb3", "G3"]],
    },
  ],
  phrygian: [
    {
      label: "Menor natural en C",
      description: "C, D, Eb, F, G, Ab, Bb",
      chords: [["C3", "Eb3", "G3"], ["D3", "F3", "Ab3"], ["G3", "Bb3", "D4"], ["C3", "Eb3", "G3"]],
    },
    {
      label: "Frigio en C",
      description: "C, Db (¡la 2ª bajada!), Eb, F, G, Ab, Bb — mucho más oscuro.",
      chords: [["C3", "Eb3", "G3"], ["Db3", "F3", "Ab3"], ["G3", "Bb3", "D4"], ["C3", "Eb3", "G3"]],
    },
  ],
};

export default function ProgressionAB({ progression }: { progression: string }) {
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const items = PROGRESSIONS[progression] ?? PROGRESSIONS["i-VI-III-VII"];

  useEffect(() => {
    return () => {
      synthRef.current?.dispose();
    };
  }, []);

  async function play(idx: number) {
    await ensureAudio();
    if (!synthRef.current) {
      synthRef.current = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.05, decay: 0.4, sustain: 0.5, release: 1.0 },
        volume: -12,
      }).toDestination();
    }
    setPlayingIdx(idx);
    const chords = items[idx].chords;
    const start = Tone.now() + 0.05;
    chords.forEach((chord, i) => {
      synthRef.current?.triggerAttackRelease(chord, "1n", start + i * 1.0);
    });
    setTimeout(() => setPlayingIdx(null), chords.length * 1000 + 500);
  }

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="grid gap-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-lg border bg-secondary/20 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">
                  {item.description}
                </div>
              </div>
              <Button
                size="icon"
                onClick={() => play(i)}
                disabled={playingIdx !== null}
                className="h-10 w-10 shrink-0 rounded-full"
              >
                <Volume2 className="!h-4 !w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
