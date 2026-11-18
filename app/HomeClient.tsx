"use client";

import { useState, type FormEvent } from "react";
import type { AnalyzeResult, ClassifiedPost, Sentiment } from "@/lib/types";
import { dict, mentions, type Dict, type Lang } from "@/lib/i18n";
import AdCard from "./components/AdCard";

const COLUMNS: Array<{ key: Sentiment; emoji: string }> = [
  { key: "negative", emoji: "−" },
  { key: "positive", emoji: "+" },
  { key: "neutral", emoji: "○" },
];

function formatDate(iso: string | undefined, locale: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString(locale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function HomeClient({ lang }: { lang: Lang }) {
  const t = dict[lang];
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyzeResult | null>(null);

  async function run(brand: string) {
    const q = brand.trim();
    if (q.length < 2) {
      setError(t.minChars);
      return;
    }
    setQuery(q);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analyze?q=${encodeURIComponent(q)}&lang=${lang}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? t.genericError);
      setData(json as AnalyzeResult);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : t.genericError);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void run(query);
  }

  const total = data ? data.counts.positive + data.counts.negative + data.counts.neutral : 0;

  return (
    <main className="wrap">
      <header className={`hero${!data && !loading ? " hero-center" : ""}`}>
        <h1>{t.heading}</h1>

        <form className="search" onSubmit={onSubmit} role="search">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                fill="currentColor"
                d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"
              />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              maxLength={80}
              autoFocus
            />
            <button type="submit" disabled={loading}>
              {loading ? <span className="spinner" aria-label={t.searching} /> : t.search}
            </button>
          </div>
        </form>

        {!loading && (
          <p className="hints">
            <span className="hints-label">{t.tryLabel}</span>
            {t.suggestions.map((s, i) => (
              <span key={s}>
                <button type="button" className="hint" onClick={() => void run(s)}>
                  {s}
                </button>
                {i < t.suggestions.length - 1 && <span className="hint-sep">·</span>}
              </span>
            ))}
          </p>
        )}
      </header>

      {error && <div className="alert">{error}</div>}

      {loading && (
        <section className="grid" aria-busy="true">
          {COLUMNS.map((c) => (
            <div key={c.key} className={`col col-${c.key} skeleton`}>
              <div className="sk-line w40" />
              <div className="sk-line w70 tall" />
              <div className="sk-card" />
              <div className="sk-card" />
            </div>
          ))}
        </section>
      )}

      {data && !loading && (
        <>
          <h2 className="results-title">
            {lang === "uk" ? `«${data.brand}»` : `“${data.brand}”`}:{" "}
            {total > 0 ? `${total} ${mentions(total, lang)}` : t.nothingFound}
          </h2>

          {total > 0 && (
          <section className="grid">
            {COLUMNS.map((c) => (
              <Column
                key={c.key}
                sentiment={c.key}
                title={t[c.key]}
                mark={c.emoji}
                count={data.counts[c.key]}
                pct={total ? Math.round((data.counts[c.key] / total) * 100) : 0}
                posts={data.posts[c.key]}
                lang={lang}
                t={t}
              />
            ))}
          </section>
          )}
        </>
      )}
      {data && !loading && <AdCard key={data.brand} lang={lang} />}
    </main>
  );
}

function Column(props: {
  sentiment: Sentiment;
  title: string;
  mark: string;
  count: number;
  pct: number;
  posts: ClassifiedPost[];
  lang: Lang;
  t: Dict;
}) {
  const { t, lang } = props;
  const [expanded, setExpanded] = useState(false);
  const sorted = [...props.posts].sort(
    (a, b) => new Date(b.timestamp ?? 0).getTime() - new Date(a.timestamp ?? 0).getTime(),
  );
  const visible = expanded ? sorted : sorted.slice(0, 1);

  return (
    <div className={`col col-${props.sentiment}`}>
      <div className="col-head">
        <span className="col-mark">{props.mark}</span>
        <span className="col-title">{props.title}</span>
      </div>
      <div className="col-stat">
      <div className="col-count">
        {props.count}
        <span className="col-pct">{props.pct}%</span>
      </div>
      <div className="col-label">
        {props.count} {mentions(props.count, lang)}
      </div>
      </div>

      <ul className="posts">
        {visible.map((p) => (
          <li key={p.id} className="post">
            <p className="post-text">{p.text}</p>
            <div className="post-meta">
              {p.username && <span>@{p.username}</span>}
              {p.timestamp && <span>{formatDate(p.timestamp, t.dateLocale)}</span>}
              {p.permalink && (
                <a href={p.permalink} target="_blank" rel="noopener noreferrer">
                  {t.open}
                </a>
              )}
            </div>
          </li>
        ))}
        {props.posts.length === 0 && <li className="empty">{t.noMentions}</li>}
      </ul>

      {props.posts.length > 1 && (
        <button type="button" className="more" onClick={() => setExpanded((v) => !v)}>
          {expanded ? t.collapse : `${t.seeMore} (${props.posts.length - 1})`}
        </button>
      )}
    </div>
  );
}
