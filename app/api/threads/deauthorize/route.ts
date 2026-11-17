import { NextResponse } from "next/server";
import { parseSignedRequest, readSignedRequest } from "@/lib/signed-request";

export const dynamic = "force-dynamic";

/**
 * Meta викликає цю адресу, коли користувач Threads відключає застосунок.
 * Сервіс не зберігає даних про користувачів, тож нічого видаляти не потрібно.
 */
export async function POST(req: Request) {
  const data = parseSignedRequest(await readSignedRequest(req));
  console.log("Threads deauthorize", data?.user_id ?? "unknown");
  return NextResponse.json({ success: true });
}

export function GET() {
  return NextResponse.json({ endpoint: "threads-deauthorize", method: "POST" });
}
