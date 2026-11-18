"use client";

import { useEffect, useState } from "react";
import { autfitterAd as ad } from "@/lib/ad";
import type { Lang } from "@/lib/i18n";

export default function AdCard({ lang }: { lang: Lang }) {
  const texts = ad.texts[lang];
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), ad.intervalMs);
    return () => window.clearInterval(id);
  }, []);

  const text = texts[tick % texts.length];
  const logo = ad.logos[tick % ad.logos.length];

  return (
    <a className="ad-card" href={ad.url} target="_blank" rel="noopener sponsored" aria-label={`${ad.name}: ${text}`}>
      <span className="ad-logo-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={logo} src={logo} alt={ad.name} width={56} height={56} className="ad-logo" />
      </span>
      <span className="ad-body">
        <span className="ad-meta">
          <span className="ad-name">{ad.name}</span>
          <span className="ad-label">{ad.label[lang]}</span>
        </span>
        <span key={text} className="ad-text">
          {text}
        </span>
      </span>
      <span className="ad-cta">{ad.cta[lang]}</span>
    </a>
  );
}
