import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Subset of SynthState we let the model fill — the rest defaults on the client.
const PresetSchema = z.object({
  osc1Type: z.enum(["sawtooth", "square", "sine", "triangle"]),
  osc2Type: z.enum(["sawtooth", "square", "sine", "triangle"]),
  osc2Detune: z.number().min(-1200).max(1200),
  osc2Mix: z.number().min(0).max(1),
  subLevel: z.number().min(0).max(1),
  filterType: z.enum(["lowpass", "highpass", "bandpass"]),
  filterCutoff: z.number().min(80).max(12000),
  filterRes: z.number().min(0).max(20),
  ampAttack: z.number().min(0.001).max(4),
  ampDecay: z.number().min(0.01).max(4),
  ampSustain: z.number().min(0).max(1),
  ampRelease: z.number().min(0.01).max(6),
  filterEnvAmount: z.number().min(0).max(1),
  filterAttack: z.number().min(0.001).max(4),
  filterDecay: z.number().min(0.01).max(4),
  filterSustain: z.number().min(0).max(1),
  filterRelease: z.number().min(0.01).max(6),
  lfoRate: z.number().min(0.05).max(20),
  lfoDepth: z.number().min(0).max(1),
  lfoTarget: z.enum(["off", "filter", "amp"]),
  delayMix: z.number().min(0).max(0.7),
  delayTime: z.number().min(0.05).max(1),
  reverbMix: z.number().min(0).max(0.9),
  drive: z.number().min(0).max(1),
  volume: z.number().min(-30).max(0),
  description: z.string(),
});

const Body = z.object({
  vibe: z.string().max(160).optional(),
  family: z.enum(["bass", "pluck", "pad", "lead", "stab"]).optional(),
});

const SYSTEM = `You are a sound designer specialised in techno and its variants
(melodic techno, progressive, hypnotic, hard, peak-time). You generate synth
preset values that produce musical, usable sounds — never extreme, always
playable.

Rules of thumb:
- Bass: filter cutoff 400-900 Hz, sub 0.4-0.7, short filter envelope decay 100-300ms
- Pluck: square or saw, ampDecay 200-300ms, ampSustain 0, delay 0.2-0.5, reverb 0.3-0.6
- Pad: ampAttack 1-2.5s, ampSustain 0.6-0.85, lfoTarget "filter", lfoRate 0.3-0.6, reverb 0.5-0.7
- Lead: filter cutoff 2-4 kHz, ampSustain 0.5-0.7, drive 0-0.2
- Stab: ampDecay 150-250ms, ampSustain 0, delay 0.25-0.5

Never set lfoDepth above 0.5. Never set drive above 0.5. Never set reverb
above 0.7. Volume should stay between -16 and -8 dB. The "description" must
be one short sentence in Spanish describing what this sound is and what it
is good for.`;

export async function POST(req: Request) {
  try {
    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid body" }, { status: 400 });
    }
    const { vibe, family } = parsed.data;

    const userPrompt =
      `Generate a ${family ?? "bass"} sound for techno.` +
      (vibe ? ` Vibe: ${vibe}.` : "") +
      ` Output values must satisfy the schema exactly.`;

    const result = await generateText({
      model: "anthropic/claude-haiku-4.5",
      output: Output.object({ schema: PresetSchema }),
      system: SYSTEM,
      prompt: userPrompt,
      temperature: 0.9,
    });

    return NextResponse.json({ preset: result.output });
  } catch (e) {
    console.error("[api/ai/preset] failed", e);
    const message = e instanceof Error ? e.message : "internal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
