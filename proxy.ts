import { NextResponse, type NextRequest } from "next/server";

/** Країни, для яких доступ до сайту закрито (код ISO 3166-1 alpha-2). */
const BLOCKED_COUNTRIES = new Set(["RU"]);

const BLOCKED_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Access restricted</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,-apple-system,sans-serif;color:#16161a;background:#fff;text-align:center;padding:24px}
h1{font-size:24px;margin:0 0 8px}p{color:#6b6a72;margin:0}</style></head>
<body><div><h1>Access restricted</h1><p>This service is not available in your region.</p></div></body></html>`;

/**
 * Блокує запити з певних країн. Країну за IP визначає Vercel (заголовок x-vercel-ip-country).
 * Локально цього заголовка немає, тож у розробці нічого не блокується.
 */
export function proxy(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country")?.toUpperCase();
  if (country && BLOCKED_COUNTRIES.has(country)) {
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Access restricted in your region." }, { status: 451 });
    }
    return new NextResponse(BLOCKED_HTML, {
      status: 451,
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
    });
  }
  return NextResponse.next();
}

export const config = {
  // усе, крім статичних файлів Next.js
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
