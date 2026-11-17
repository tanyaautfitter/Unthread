import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/Footer";
import LangSwitcher from "./components/LangSwitcher";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const t = dict[await getLang()];
  return { title: t.metaTitle, description: t.metaDescription };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang}>
      <body>
        <LangSwitcher lang={lang} label={dict[lang].langLabel} />
        {children}
        <Footer lang={lang} />
      </body>
    </html>
  );
}
