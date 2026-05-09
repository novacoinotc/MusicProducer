"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SynthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[synth/error.tsx]", error);
  }, [error]);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-xl rounded-xl border border-destructive/40 bg-card p-6">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <h1 className="mt-3 text-xl font-semibold">
          Algo falló cargando el Sound Design Lab
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Esto suele ser un problema con Web Audio en este navegador.
          Prueba recargar; si persiste, abre la consola del navegador para más
          detalles.
        </p>
        <pre className="mt-3 max-h-40 overflow-auto rounded-md bg-secondary/30 p-3 text-xs">
          {error.message}
          {error.digest ? `\n\ndigest: ${error.digest}` : ""}
        </pre>
        <div className="mt-5 flex gap-2">
          <Button onClick={reset}>Reintentar</Button>
          <Button asChild variant="outline">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
