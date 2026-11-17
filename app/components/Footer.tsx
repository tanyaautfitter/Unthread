import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="site-foot-inner">
        <nav className="site-foot-col" aria-label="Документи">
          <h2 className="site-foot-title">Документи</h2>
          <Link href="/privacy">Політика конфіденційності</Link>
          <Link href="/privacy#deletion">Видалення даних</Link>
          <Link href="/cookies">Політика файлів cookie</Link>
        </nav>

        <div className="site-foot-col">
          <h2 className="site-foot-title">Контакти</h2>
          <span>Підтримка</span>
          <a href={`mailto:${site.email}`} className="site-foot-mail">
            {site.email}
          </a>
        </div>
      </div>

      <div className="site-foot-bottom">
        <span>
          © {site.year} {site.name}. {site.operator}
        </span>
        <span>Threads є торговою маркою Meta Platforms, Inc. Сайт не пов'язаний з Meta.</span>
      </div>
    </footer>
  );
}
