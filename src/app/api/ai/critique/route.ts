import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const FeedbackItem = z.object({
  category: z.enum(["mix", "structure", "sound-design", "groove", "arrangement"]),
  severity: z.enum(["good", "info", "warning", "issue"]),
  title: z.string(),
  description: z.string(),
  suggestion: z.string(),
});

const CritiqueSchema = z.object({
  overallScore: z.number().min(0).max(100),
  overallSummary: z.string(),
  strongPoints: z.array(z.string()).min(1).max(3),
  feedback: z.array(FeedbackItem).min(3).max(7),
});

const Body = z.object({
  bpm: z.number(),
  durationSec: z.number(),
  totalBars: z.number(),
  sections: z.array(
    z.object({
      type: z.string(),
      lengthBars: z.number(),
      avgEnergy: z.number(),
    }),
  ),
  bandSummary: z
    .object({
      sub: z.number(),
      bass: z.number(),
      lowMid: z.number(),
      mid: z.number(),
      highMid: z.number(),
      air: z.number(),
    })
    .optional(),
  energyMin: z.number(),
  energyMax: z.number(),
  trackTitle: z.string().optional(),
});

const SYSTEM = `You are a senior techno producer giving constructive feedback
on a track an emerging producer is working on.

Style: direct, technical, kind, in Spanish. Treat the producer like a peer who
wants real feedback, not a beginner who needs hand-holding.

You receive structural metadata only — BPM, sections, energy distribution per
band, total bars. You do NOT have access to the audio itself, so frame
feedback as observations and questions, not certainties.

Look for:
- BPM that doesn't fit the implied style (e.g. 145 BPM but stated melodic)
- Section structure issues: intro too short for DJ-friendly mix, breakdown
  too brief in melodic, drop too long, no breakdown at all
- Frequency band imbalance: too much bass / not enough air / muddy low-mids
- Energy curve flatness (no contrast between sections)
- Track length issues (under 5 min for techno is short, over 9 min is long)

Always return:
- overallScore 0-100
- overallSummary: 1-2 sentences in Spanish
- 1-3 strongPoints in Spanish (what is working well)
- 3-7 feedback items, each with category, severity, title, description, suggestion (all Spanish)`;

export async function POST(req: Request) {
  try {
    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid body" }, { status: 400 });
    }

    const data = parsed.data;
    const userPrompt = `Analyze this techno track:

Title: ${data.trackTitle ?? "(sin nombre)"}
BPM: ${data.bpm}
Duration: ${Math.floor(data.durationSec / 60)}:${Math.floor(data.durationSec % 60).toString().padStart(2, "0")}
Total bars: ${data.totalBars}
Energy range: ${data.energyMin.toFixed(2)} – ${data.energyMax.toFixed(2)}

Sections (in order):
${data.sections.map((s) => `- ${s.type} · ${s.lengthBars} bars · avg energy ${s.avgEnergy.toFixed(2)}`).join("\n")}

${data.bandSummary
  ? `Frequency band averages (0-1 scale):
- Sub (20-60 Hz): ${data.bandSummary.sub.toFixed(2)}
- Bass (60-250 Hz): ${data.bandSummary.bass.toFixed(2)}
- Low mid (250-500 Hz): ${data.bandSummary.lowMid.toFixed(2)}
- Mid (500 Hz - 2 kHz): ${data.bandSummary.mid.toFixed(2)}
- High mid (2-6 kHz): ${data.bandSummary.highMid.toFixed(2)}
- Air (6-20 kHz): ${data.bandSummary.air.toFixed(2)}`
  : ""}

Provide critique in Spanish.`;

    const result = await generateText({
      model: "anthropic/claude-haiku-4.5",
      output: Output.object({ schema: CritiqueSchema }),
      system: SYSTEM,
      prompt: userPrompt,
      temperature: 0.7,
    });

    return NextResponse.json({ critique: result.output });
  } catch (e) {
    console.error("[api/ai/critique] failed", e);
    const message = e instanceof Error ? e.message : "internal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
