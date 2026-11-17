import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="site-foot-inner">
        <div className="site-foot-brand">
          <Link href="/" className="logo">
            <span className="logo-mark">@</span> {site.name}
          </Link>
          <p>
            Аналіз тональності публічних згадок брендів у Threads. Дані: офіційний Threads API. Результат базується на
            вибірці останніх згадок, а не на всій історії.
          </p>
        </div>

        <nav className="site-foot-links" aria-label="Юридична інформація">
          <Link href="/privacy">Політика конфіденційності</Link>
          <Link href="/cookies">Політика файлів cookie</Link>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </nav>
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
