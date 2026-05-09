"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const LABEL: Record<string, string> = {
  "/groove": "Groove Lab",
  "/synth": "Sound Design Lab",
  "/ear": "Entrenamiento de oído",
  "/arrange": "Arrangement Coach",
  "/deconstruct": "Track Deconstructor",
};

export default function GoToLab({ href }: { href: string }) {
  const label = LABEL[href] ?? href;
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
      <p className="text-sm text-muted-foreground">
        Esta práctica usa una de las labs interactivas. Abre el lab en una pestaña nueva, sigue la instrucción de arriba, y vuelve aquí para hacer el check.
      </p>
      <div className="mt-4">
        <Button asChild size="lg">
          <Link href={href} target="_blank" rel="noopener noreferrer">
            Abrir {label}
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}
