"use client";

import { useEffect, useState } from "react";
import { autfitterAd as ad } from "@/lib/ad";
import type { Lang } from "@/lib/i18n";

/** Плаваюча реклама Autfitter внизу екрана: з'являється через 5 секунд, її можна закрити. */
export default function AdCard({ lang }: { lang: Lang }) {
  const texts = ad.texts[lang];
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  const [tick, setTick] = useState(0);
  const [primary, setPrimary] = useState(ad.appStore);

  useEffect(() => {
    if (/android/i.test(navigator.userAgent)) setPrimary(ad.googlePlay);
    const show = window.setTimeout(() => setVisible(true), ad.delayMs);
    return () => window.clearTimeout(show);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = window.setInterval(() => setTick((t) => t + 1), ad.intervalMs);
    return () => window.clearInterval(id);
  }, [visible]);

  if (!visible || closed) return null;

  const text = texts[tick % texts.length];
  const logo = ad.logos[tick % ad.logos.length];

  return (
    <aside className="ad-float" aria-label={`${ad.name} — ${ad.label[lang]}`}>
      <div className="ad-card">
        <a className="ad-logo-wrap" href={primary} target="_blank" rel="noopener sponsored">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={logo} src={logo} alt={ad.name} width={56} height={56} className="ad-logo" />
        </a>
        <div className="ad-body">
          <span className="ad-meta">
            <span className="ad-name">{ad.name}</span>
            <span className="ad-label">{ad.label[lang]}</span>
          </span>
          <span key={text} className="ad-text">
            {text}
          </span>
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
        <a className="ad-cta" href={primary} target="_blank" rel="noopener sponsored">
          {ad.cta[lang]}
        </a>
        <button type="button" className="ad-close" aria-label={ad.close[lang]} onClick={() => setClosed(true)}>
          ×
        </button>
      </div>
    </aside>
  );
}
