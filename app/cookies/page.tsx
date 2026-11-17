import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";
import CookiesUk from "../components/legal/CookiesUk";
import CookiesEn from "../components/legal/CookiesEn";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: `${dict[lang].cookies} — ${site.name}`,
    description: lang === "uk" ? "Які файли cookie використовує Unthread." : "Which cookies Unthread uses.",
  };
}

export default async function Page() {
  const lang = await getLang();
  return (
    <LegalPage title={dict[lang].cookies} lang={lang}>
      {lang === "uk" ? <CookiesUk /> : <CookiesEn />}
    </LegalPage>
  );
}
