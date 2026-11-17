import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { parseSignedRequest, readSignedRequest } from "@/lib/signed-request";

export const dynamic = "force-dynamic";

/**
 * Запит Meta на видалення даних користувача Threads.
 * Сервіс не має бази даних; пости живуть лише в кеші до 1 години.
 * Відповідь має формат, якого вимагає Meta: { url, confirmation_code }.
 */
export async function POST(req: Request) {
  const data = parseSignedRequest(await readSignedRequest(req));
  const code = randomBytes(8).toString("hex");
  console.log("Threads data deletion request", data?.user_id ?? "unknown", code);
  const origin = new URL(req.url).origin;
  return NextResponse.json({ url: `${origin}/privacy#deletion`, confirmation_code: code });
}

export function GET() {
  return NextResponse.json({ endpoint: "threads-data-deletion", method: "POST" });
}
