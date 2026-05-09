import Link from "next/link";
import { Disc3 } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Disc3 className="h-5 w-5 text-primary" />
          <span>MusicTrainer</span>
          <span className="ml-1 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-primary">
            beta
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm text-muted-foreground">
          <Link
            href="/clases"
            className="rounded-md bg-primary/15 px-3 py-1.5 font-medium text-primary hover:bg-primary/25"
          >
            Curso
          </Link>
          <Link
            href="/groove"
            className="rounded-md px-3 py-1.5 hover:bg-accent hover:text-foreground"
          >
            Groove
          </Link>
          <Link
            href="/synth"
            className="rounded-md px-3 py-1.5 hover:bg-accent hover:text-foreground"
          >
            Synth
          </Link>
          <Link
            href="/ear"
            className="rounded-md px-3 py-1.5 hover:bg-accent hover:text-foreground"
          >
            Oído
          </Link>
          <Link
            href="/arrange"
            className="rounded-md px-3 py-1.5 hover:bg-accent hover:text-foreground"
          >
            Arreglo
          </Link>
          <Link
            href="/deconstruct"
            className="rounded-md px-3 py-1.5 hover:bg-accent hover:text-foreground"
          >
            Deconstruir
          </Link>
          <Link
            href="/challenges"
            className="rounded-md px-3 py-1.5 hover:bg-accent hover:text-foreground"
          >
            Retos
          </Link>
        </nav>
      </div>
    </header>
  );
}
