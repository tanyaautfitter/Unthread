"use client";

import { useRouter } from "next/navigation";
import { LANG_COOKIE, type Lang } from "@/lib/i18n";

const OPTIONS: Array<{ code: Lang; label: string }> = [
  { code: "uk", label: "UA" },
  { code: "en", label: "EN" },
];

export default function LangSwitcher({ lang, label }: { lang: Lang; label: string }) {
  const router = useRouter();

  function choose(code: Lang) {
    if (code === lang) return;
    document.cookie = `${LANG_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <div className="lang-switch" role="group" aria-label={label}>
      {OPTIONS.map((o) => (
        <button
          key={o.code}
          type="button"
          className={o.code === lang ? "active" : ""}
          aria-pressed={o.code === lang}
          onClick={() => choose(o.code)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
