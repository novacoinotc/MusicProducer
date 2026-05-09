"use client";

import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ensureAudio } from "@/lib/audio/engine";

export default function FreqSlider() {
  const [freq, setFreq] = useState(440);
  const [playing, setPlaying] = useState(false);
  const oscRef = useRef<Tone.Oscillator | null>(null);

  useEffect(() => {
    return () => {
      oscRef.current?.stop();
      oscRef.current?.dispose();
    };
  }, []);

  async function toggle() {
    await ensureAudio();
    if (playing) {
      oscRef.current?.stop();
      oscRef.current?.dispose();
      oscRef.current = null;
      setPlaying(false);
    } else {
      const osc = new Tone.Oscillator({ frequency: freq, type: "sine", volume: -16 }).toDestination();
      osc.start();
      oscRef.current = osc;
      setPlaying(true);
    }
  }

  function onFreq(v: number) {
    setFreq(v);
    if (oscRef.current) {
      oscRef.current.frequency.rampTo(v, 0.05);
    }
  }

  const label = freq < 1000 ? `${Math.round(freq)} Hz` : `${(freq / 1000).toFixed(1)} kHz`;

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-3">
        <Button size="icon" onClick={toggle} className="h-10 w-10 rounded-full">
          {playing ? <Square className="!h-4 !w-4" /> : <Play className="!h-4 !w-4" />}
        </Button>
        <div className="flex-1">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Frecuencia</span>
            <span className="font-mono text-sm tabular-nums">{label}</span>
          </div>
          <input
            type="range"
            min={Math.log10(40)}
            max={Math.log10(16000)}
            step={0.001}
            value={Math.log10(freq)}
            onChange={(e) => onFreq(Math.pow(10, Number(e.target.value)))}
            className="mt-2 h-1 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground/60">
            <span>40 Hz · sub</span>
            <span>440 · mid</span>
            <span>16k · air</span>
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 text-center">
        {[60, 250, 1000, 8000].map((preset) => (
          <button
            key={preset}
            onClick={() => onFreq(preset)}
            className="rounded-md border bg-secondary/30 px-2 py-1.5 font-mono text-xs hover:bg-secondary"
          >
            {preset < 1000 ? `${preset} Hz` : `${preset / 1000} kHz`}
          </button>
        ))}
      </div>
    </div>
  );
}
