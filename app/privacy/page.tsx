import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";
import PrivacyUk from "../components/legal/PrivacyUk";
import PrivacyEn from "../components/legal/PrivacyEn";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: `${dict[lang].privacy} — ${site.name}`,
    description: lang === "uk" ? "Які дані обробляє Hovir, навіщо, як довго зберігає та які у вас права." : "What data Hovir processes, why, for how long, and your rights.",
  };
}

export default async function Page() {
  const lang = await getLang();
  return (
    <LegalPage title={dict[lang].privacy} lang={lang}>
      {lang === "uk" ? <PrivacyUk /> : <PrivacyEn />}
    </LegalPage>
  );
}
