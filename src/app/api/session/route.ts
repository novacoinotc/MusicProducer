import { NextResponse } from "next/server";
import { getOrCreateSessionId } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const id = await getOrCreateSessionId();
    return NextResponse.json({ sessionId: id });
  } catch (e) {
    console.error("[api/session] failed", e);
    return NextResponse.json(
      { error: "session init failed" },
      { status: 500 },
    );
  }
}
