"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TapTempo() {
  const [taps, setTaps] = useState<number[]>([]);
  const [bpm, setBpm] = useState<number | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space") {
        e.preventDefault();
        tap();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taps]);

  function tap() {
    const now = performance.now();
    setTaps((prev) => {
      const next = [...prev, now].slice(-8);
      if (next.length >= 2) {
        const intervals: number[] = [];
        for (let i = 1; i < next.length; i++) intervals.push(next[i] - next[i - 1]);
        const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        setBpm(Math.round(60000 / avg));
      }
      return next;
    });
  }

  function reset() {
    setTaps([]);
    setBpm(null);
  }

  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="mb-4 text-sm text-muted-foreground">
        Pulsa la barra espaciadora (o el botón grande) a un ritmo constante. La app calcula tu BPM con cada tap.
      </p>
      <button
        onClick={tap}
        className="block w-full rounded-2xl border-2 border-primary/40 bg-primary/10 py-12 transition-colors hover:bg-primary/20"
      >
        <div className="font-mono text-6xl font-bold tabular-nums">
          {bpm ?? "—"}
        </div>
        <div className="mt-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          BPM · {taps.length} taps
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          {taps.length < 2 ? "Pulsa varias veces para empezar" : "Sigue pulsando — cuanto más, más preciso"}
        </div>
      </button>
      <div className="mt-3 flex items-center justify-between">
        <div className="font-mono text-[10px] text-muted-foreground">
          Referencia: melodic 122 · peak 130 · hard 145
        </div>
        <Button size="sm" variant="ghost" onClick={reset}>
          <RotateCcw />
          Reset
        </Button>
      </div>
    </div>
  );
}
