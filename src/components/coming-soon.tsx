import Link from "next/link";
import { Construction, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export function ComingSoon({
  module,
  title,
  description,
}: {
  module: string;
  title: string;
  description: string;
}) {
  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            {module}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-muted-foreground">{description}</p>

          <div className="mt-10 rounded-xl border border-dashed bg-card p-10 text-center">
            <Construction className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold">En construcción</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Este módulo llega pronto. Mientras tanto, sigue practicando el
              groove.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild variant="outline">
                <Link href="/">
                  <ArrowLeft />
                  Volver
                </Link>
              </Button>
              <Button asChild>
                <Link href="/groove">Ir al Groove Lab</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
