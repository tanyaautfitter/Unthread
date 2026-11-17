import Link from "next/link";
import { site } from "@/lib/site";

export default function LegalPage(props: { title: string; children: React.ReactNode }) {
  return (
    <main className="legal">
      <Link href="/" className="legal-back">
        ← На головну
      </Link>
      <h1>{props.title}</h1>
      <p className="legal-date">
        Набирає чинності: {site.effectiveDate} · Остання редакція: {site.effectiveDate}
      </p>
      {props.children}
    </main>
  );
}
