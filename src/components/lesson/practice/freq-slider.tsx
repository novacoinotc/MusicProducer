"use client";

import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { Play, Square, Headphones } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ensureAudio } from "@/lib/audio/engine";
import { cn } from "@/lib/utils";

export default function FreqSlider() {
  const [freq, setFreq] = useState(440);
  const [playing, setPlaying] = useState(false);
  const oscRef = useRef<Tone.Oscillator | null>(null);

  useEffect(() => {
    return () => {
      try {
        oscRef.current?.stop();
        oscRef.current?.dispose();
      } catch {
        // noop
      }
    };
  }, []);

  async function toggle() {
    try {
      if (playing) {
        oscRef.current?.stop();
        oscRef.current?.dispose();
        oscRef.current = null;
        setPlaying(false);
        return;
      }
      await ensureAudio();
      const osc = new Tone.Oscillator({
        frequency: freq,
        type: "sine",
        volume: -8,
      }).toDestination();
      osc.start();
      oscRef.current = osc;
      setPlaying(true);
    } catch (e) {
      console.error("[freq-slider] toggle failed", e);
      toast.error("No se pudo iniciar el audio. Recarga la página.");
    }
  }

  function onFreq(v: number) {
    setFreq(v);
    if (oscRef.current) {
      oscRef.current.frequency.rampTo(v, 0.05);
    }
  }

  const label =
    freq < 1000 ? `${Math.round(freq)} Hz` : `${(freq / 1000).toFixed(1)} kHz`;
  const isSub = freq < 100;

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          onClick={toggle}
          className={cn(
            "h-12 w-12 shrink-0 rounded-full",
            playing && "bg-primary/30 text-primary hover:bg-primary/40",
          )}
          variant={playing ? "secondary" : "default"}
          aria-label={playing ? "Detener" : "Reproducir"}
        >
          {playing ? (
            <Square className="!h-5 !w-5" />
          ) : (
            <Play className="!h-5 !w-5" />
          )}
        </Button>
        <div className="flex-1">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Frecuencia
            </span>
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

      {playing && isSub && (
        <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs">
          <Headphones className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <div>
            <strong className="text-amber-400">Estás en sub-bass.</strong> Las
            bocinas de laptop no reproducen frecuencias debajo de ~100 Hz —
            está sonando, pero necesitas audífonos o un subwoofer para oírlo.
            Sube a 440 Hz para confirmar que tu audio funciona.
          </div>
        </div>
      )}

      {!playing && (
        <p className="mt-3 text-xs text-muted-foreground">
          Pulsa play para empezar. Empezamos en 440 Hz (la nota La) — bien
          audible en cualquier bocina.
        </p>
      )}
    </div>
  );
}
