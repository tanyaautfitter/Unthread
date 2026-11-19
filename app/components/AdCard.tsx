"use client";

import { useEffect, useState } from "react";
import "@fontsource/playfair-display/latin-500-italic.css";
import "@fontsource/playfair-display/cyrillic-500-italic.css";
import { autfitterAd as ad } from "@/lib/ad";
import type { Lang } from "@/lib/i18n";

/**
 * Реклама Autfitter поруч із результатами.
 * На широкому екрані — вертикальний банер праворуч від колонок, на вузькому — горизонтальна картка під ними.
 */
export default function AdCard({ lang }: { lang: Lang }) {
  const texts = ad.texts[lang];
  const [tick, setTick] = useState(0);
  const [primary, setPrimary] = useState(ad.appStore);

  useEffect(() => {
    if (/android/i.test(navigator.userAgent)) setPrimary(ad.googlePlay);
    const id = window.setInterval(() => setTick((t) => t + 1), ad.intervalMs);
    return () => window.clearInterval(id);
  }, []);

  const text = texts[tick % texts.length];
  const logo = ad.logos[tick % ad.logos.length];

  return (
    <div className="ad-card" aria-label={`${ad.name} — ${ad.label[lang]}`}>
      <span className="ad-label">{ad.label[lang]}</span>
      <a className="ad-logo-wrap" href={primary} target="_blank" rel="noopener sponsored">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={logo} src={logo} alt={ad.name} width={96} height={96} className="ad-logo" />
      </a>
      <div className="ad-body">
        <span className="ad-name">{ad.name}</span>
        <span key={text} className="ad-text">
          {text}
        </span>
      </div>
      <div className="ad-actions">
        <a className="ad-cta" href={primary} target="_blank" rel="noopener sponsored">
          {ad.cta[lang]}
        </a>
        <span className="ad-stores">
          <a href={ad.appStore} target="_blank" rel="noopener sponsored">
            App Store
          </a>
          <span aria-hidden="true">·</span>
          <a href={ad.googlePlay} target="_blank" rel="noopener sponsored">
            Google Play
          </a>
        </span>
      </div>
    </div>
  );
}
