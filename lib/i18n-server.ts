import { cookies, headers } from "next/headers";
import { detectLang, LANG_COOKIE, type Lang } from "./i18n";

/** Визначає мову для поточного запиту (лише на сервері). */
export async function getLang(): Promise<Lang> {
  const [c, h] = await Promise.all([cookies(), headers()]);
  return detectLang({
    cookie: c.get(LANG_COOKIE)?.value,
    acceptLanguage: h.get("accept-language"),
    country: h.get("x-vercel-ip-country"),
  });
}
