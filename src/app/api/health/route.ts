import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const start = Date.now();
    const rows = await db.execute<{ table_name: string }>(
      sql`select table_name from information_schema.tables where table_schema = 'public' order by table_name`,
    );
    const tables = rows.rows.map((r) => r.table_name);
    return NextResponse.json({
      ok: true,
      latencyMs: Date.now() - start,
      tables,
    });
  } catch (e) {
    console.error("[health] db check failed", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
