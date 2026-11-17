import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";
import TermsUk from "../components/legal/TermsUk";
import TermsEn from "../components/legal/TermsEn";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: `${dict[lang].terms} — ${site.name}`,
    description: lang === "uk" ? "Правила користування сервісом Hovir." : "Rules for using the Hovir service.",
  };
}

export default async function Page() {
  const lang = await getLang();
  return (
    <LegalPage title={dict[lang].terms} lang={lang}>
      {lang === "uk" ? <TermsUk /> : <TermsEn />}
    </LegalPage>
  );
}
