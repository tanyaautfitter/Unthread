import Link from "next/link";
import { dict, type Lang } from "@/lib/i18n";

export default function LegalPage(props: { title: string; lang: Lang; children: React.ReactNode }) {
  const t = dict[props.lang];
  return (
    <main className="legal">
      <Link href="/" className="legal-back">
        {t.backHome}
      </Link>
      <h1>{props.title}</h1>
      <p className="legal-date">
        {t.effective}: {t.effectiveDate} · {t.revised}: {t.effectiveDate}
      </p>
      {props.children}
    </main>
  );
}
