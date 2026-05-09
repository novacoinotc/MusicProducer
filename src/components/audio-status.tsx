"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  audioContextState,
  playTestBeep,
} from "@/lib/audio/engine";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * A diagnostic strip the user can render anywhere to confirm audio works.
 * Shows the current AudioContext state and a Test button that plays a beep.
 */
export function AudioStatus() {
  const [state, setState] = useState<string>("?");
  const [testing, setTesting] = useState(false);
  const [lastBeepHeard, setLastBeepHeard] = useState<boolean | null>(null);

  useEffect(() => {
    setState(audioContextState());
    const t = setInterval(() => setState(audioContextState()), 1500);
    return () => clearInterval(t);
  }, []);

  async function test() {
    setTesting(true);
    setLastBeepHeard(null);
    try {
      await playTestBeep();
      toast("¿Oíste el beep de medio segundo?", {
        action: {
          label: "Sí",
          onClick: () => setLastBeepHeard(true),
        },
        cancel: {
          label: "No",
          onClick: () => setLastBeepHeard(false),
        },
        duration: 6000,
      });
    } catch (e) {
      console.error("[audio-status] test failed", e);
      toast.error(
        e instanceof Error ? e.message : "No se pudo iniciar el audio",
      );
      setLastBeepHeard(false);
    } finally {
      setTimeout(() => setTesting(false), 800);
    }
  }

  const isRunning = state === "running";

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full",
              isRunning
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-amber-500/20 text-amber-400",
            )}
          >
            {isRunning ? (
              <Volume2 className="h-3.5 w-3.5" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}
          </span>
          <div>
            <p className="text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Audio:{" "}
              </span>
              <span className={isRunning ? "text-emerald-400" : "text-amber-400"}>
                {state === "running"
                  ? "activo"
                  : state === "suspended"
                    ? "suspendido"
                    : state}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              {isRunning
                ? "El navegador está produciendo sonido."
                : "Pulsa Test audio para activarlo."}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={test}
          disabled={testing}
          className="ml-auto"
        >
          {testing ? (
            <Loader2 className="!h-3 !w-3 animate-spin" />
          ) : (
            <Volume2 className="!h-3 !w-3" />
          )}
          Test audio (beep 440 Hz)
        </Button>
      </div>

      {lastBeepHeard === false && (
        <div className="mt-3 flex items-start gap-2 rounded-md border border-rose-500/40 bg-rose-500/10 p-3 text-xs">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <div>
            <strong className="text-rose-400">No oíste el beep.</strong>{" "}
            Revisa: 1) el ícono de altavoz en tu pestaña del navegador (puede
            estar en mute); 2) el volumen del sistema; 3) que la salida de
            audio sea la correcta (audífonos vs bocinas). Recarga la página
            con <kbd className="rounded bg-secondary px-1">Cmd+Shift+R</kbd> y
            vuelve a probar.
          </div>
        </div>
      )}

      {lastBeepHeard === true && (
        <p className="mt-3 text-xs text-emerald-400">
          ✓ Audio funcionando — todo listo para el curso.
        </p>
      )}
    </div>
  );
}
