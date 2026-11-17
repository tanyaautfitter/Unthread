import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    ok: true,
    version: "1.3.0",
    threads: Boolean(process.env.THREADS_ACCESS_TOKEN),
    claude: Boolean(process.env.ANTHROPIC_API_KEY),
  });
}
