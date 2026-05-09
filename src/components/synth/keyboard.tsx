"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function buildKeys(startOctave: number, octaves: number) {
  const keys: { note: string; isBlack: boolean; whiteIndex: number }[] = [];
  let whiteIndex = 0;
  for (let o = 0; o < octaves; o++) {
    for (let i = 0; i < 12; i++) {
      const name = NOTE_NAMES[i];
      const note = `${name}${startOctave + o}`;
      const isBlack = name.includes("#");
      keys.push({ note, isBlack, whiteIndex });
      if (!isBlack) whiteIndex++;
    }
  }
  return keys;
}

// QWERTY → notes (two octaves)
const KEYBOARD_MAP: Record<string, string> = {
  a: "C3",
  w: "C#3",
  s: "D3",
  e: "D#3",
  d: "E3",
  f: "F3",
  t: "F#3",
  g: "G3",
  y: "G#3",
  h: "A3",
  u: "A#3",
  j: "B3",
  k: "C4",
  o: "C#4",
  l: "D4",
  p: "D#4",
  ";": "E4",
};

export function Keyboard({
  onNoteOn,
  onNoteOff,
  startOctave = 3,
  octaves = 2,
}: {
  onNoteOn: (note: string) => void;
  onNoteOff: (note: string) => void;
  startOctave?: number;
  octaves?: number;
}) {
  const keys = buildKeys(startOctave, octaves);
  const whiteCount = keys.filter((k) => !k.isBlack).length;
  const [active, setActive] = useState<Set<string>>(new Set());
  const heldRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    function down(e: KeyboardEvent) {
      if (e.repeat) return;
      const k = e.key.toLowerCase();
      const note = KEYBOARD_MAP[k];
      if (!note) return;
      if (heldRef.current.has(note)) return;
      heldRef.current.add(note);
      onNoteOn(note);
      setActive((p) => {
        const n = new Set(p);
        n.add(note);
        return n;
      });
    }
    function up(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      const note = KEYBOARD_MAP[k];
      if (!note) return;
      heldRef.current.delete(note);
      onNoteOff(note);
      setActive((p) => {
        const n = new Set(p);
        n.delete(note);
        return n;
      });
    }
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [onNoteOn, onNoteOff]);

  function press(note: string) {
    if (heldRef.current.has(note)) return;
    heldRef.current.add(note);
    onNoteOn(note);
    setActive((p) => new Set(p).add(note));
  }

  function release(note: string) {
    if (!heldRef.current.has(note)) return;
    heldRef.current.delete(note);
    onNoteOff(note);
    setActive((p) => {
      const n = new Set(p);
      n.delete(note);
      return n;
    });
  }

  return (
    <div className="relative h-32 w-full select-none rounded-lg border bg-secondary/20 p-2">
      <div className="relative h-full w-full">
        {/* White keys */}
        <div
          className="absolute inset-0 grid h-full"
          style={{ gridTemplateColumns: `repeat(${whiteCount}, minmax(0, 1fr))` }}
        >
          {keys
            .filter((k) => !k.isBlack)
            .map((k) => {
              const isActive = active.has(k.note);
              return (
                <button
                  key={k.note}
                  type="button"
                  onMouseDown={() => press(k.note)}
                  onMouseUp={() => release(k.note)}
                  onMouseLeave={() => release(k.note)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    press(k.note);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    release(k.note);
                  }}
                  className={cn(
                    "relative flex items-end justify-center rounded-b-md border border-border bg-card pb-1 font-mono text-[10px] text-muted-foreground transition-colors",
                    isActive && "bg-primary/40 text-foreground",
                  )}
                >
                  {k.note.startsWith("C") && k.note}
                </button>
              );
            })}
        </div>

        {/* Black keys */}
        {keys
          .filter((k) => k.isBlack)
          .map((k) => {
            const isActive = active.has(k.note);
            const left = ((k.whiteIndex - 0.3) / whiteCount) * 100;
            const width = 0.6 / whiteCount * 100;
            return (
              <button
                key={k.note}
                type="button"
                onMouseDown={() => press(k.note)}
                onMouseUp={() => release(k.note)}
                onMouseLeave={() => release(k.note)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  press(k.note);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  release(k.note);
                }}
                className={cn(
                  "absolute top-0 z-10 h-3/5 rounded-b-md border border-black bg-zinc-900 transition-colors",
                  isActive && "bg-primary/70",
                )}
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                }}
                aria-label={k.note}
              />
            );
          })}
      </div>
      <p className="absolute bottom-1 right-2 font-mono text-[9px] text-muted-foreground/60">
        teclas: A-S-D-F-G-H-J · negras W-E-T-Y-U
      </p>
    </div>
  );
}
