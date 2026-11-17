import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Адреса перенаправлення OAuth. Сайт працює з одним серверним токеном, тому просто повертає на головну. */
export function GET(req: Request) {
  return NextResponse.redirect(new URL("/", req.url));
}
