"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { ensureAudio } from "@/lib/audio/engine";
import { Button } from "@/components/ui/button";

export function AudioInitButton({
  onReady,
  className,
}: {
  onReady: () => void;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      size="lg"
      className={className}
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await ensureAudio();
          onReady();
        } finally {
          setLoading(false);
        }
      }}
    >
      <Volume2 />
      {loading ? "Iniciando audio…" : "Activar audio"}
    </Button>
  );
}
