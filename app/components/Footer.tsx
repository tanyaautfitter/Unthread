import Link from "next/link";
import { site } from "@/lib/site";
import { dict, type Lang } from "@/lib/i18n";

export default function Footer({ lang }: { lang: Lang }) {
  const t = dict[lang];
  return (
    <footer className="site-foot">
      <div className="site-foot-inner">
        <nav className="site-foot-col" aria-label={t.footerDocs}>
          <h2 className="site-foot-title">{t.footerDocs}</h2>
          <Link href="/privacy">{t.privacy}</Link>
          <Link href="/terms">{t.terms}</Link>
          <Link href="/cookies">{t.cookies}</Link>
        </nav>

        <div className="site-foot-col">
          <h2 className="site-foot-title">{t.footerContacts}</h2>
          <a href={`mailto:${site.email}`} className="site-foot-mail">
            {site.email}
          </a>
        </div>
      </div>

      <div className="site-foot-bottom">
        <span>
          © {site.year} {site.name}
        </span>
        <span>{t.disclaimer}</span>
      </div>
    </footer>
  );
}
