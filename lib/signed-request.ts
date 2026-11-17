import { createHmac, timingSafeEqual } from "node:crypto";

function b64urlDecode(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

/**
 * Розбирає signed_request, який Meta надсилає на callback-адреси.
 * Якщо задано THREADS_APP_SECRET, перевіряє підпис HMAC-SHA256.
 */
export function parseSignedRequest(signed: string | null): { user_id?: string } | null {
  if (!signed || !signed.includes(".")) return null;
  const [sig, payload] = signed.split(".", 2);
  const secret = process.env.THREADS_APP_SECRET?.trim();
  if (secret) {
    const expected = createHmac("sha256", secret).update(payload).digest();
    const got = b64urlDecode(sig);
    if (got.length !== expected.length || !timingSafeEqual(got, expected)) return null;
  }
  try {
    return JSON.parse(b64urlDecode(payload).toString("utf8"));
  } catch {
    return null;
  }
}

export async function readSignedRequest(req: Request): Promise<string | null> {
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const body = (await req.json().catch(() => ({}))) as { signed_request?: string };
    return body.signed_request ?? null;
  }
  const form = await req.formData().catch(() => null);
  return (form?.get("signed_request") as string | null) ?? null;
}
