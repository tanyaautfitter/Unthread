"use client";

import { useState, type FormEvent } from "react";
import type { AnalyzeResult, ClassifiedPost, Sentiment } from "@/lib/types";

const COLUMNS: Array<{ key: Sentiment; title: string; emoji: string }> = [
  { key: "negative", title: "Негативні", emoji: "−" },
  { key: "positive", title: "Позитивні", emoji: "+" },
  { key: "neutral", title: "Нейтральні", emoji: "○" },
];

const SUGGESTIONS = ["Nova Poshta", "Monobank", "Rozetka", "Apple", "Nike"];

function plural(n: number): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "відгук";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "відгуки";
  return "відгуків";
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("uk-UA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyzeResult | null>(null);

  async function run(brand: string) {
    const q = brand.trim();
    if (q.length < 2) {
      setError("Введіть щонайменше 2 символи.");
      return;
    }
    setQuery(q);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analyze?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Щось пішло не так.");
      setData(json as AnalyzeResult);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : "Щось пішло не так.");
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
      <header className="hero">
        <div className="logo">
          <span className="logo-mark">@</span> BrandPulse
        </div>
        <h1>Що кажуть про бренд у&nbsp;Threads?</h1>
        <p className="sub">
          Введіть назву бренду. Ми знайдемо публічні згадки й розкладемо їх на позитивні, негативні та нейтральні.
        </p>

        <form className="search" onSubmit={onSubmit} role="search">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Наприклад, Nova Poshta"
            aria-label="Назва бренду"
            maxLength={80}
            autoFocus
          />
          <button type="submit" disabled={loading}>
            {loading ? <span className="spinner" aria-label="Пошук…" /> : "Пошук"}
          </button>
        </form>

        {!data && !loading && (
          <div className="chips">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" className="chip" onClick={() => void run(s)}>
                {s}
              </button>
            ))}
          </div>
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
          <section className="summary">
            <div className="summary-top">
              <h2>
                «{data.brand}»: {total} {plural(total)}
              </h2>
              <div className="badges">
                {data.source === "demo" && <span className="badge warn">демо-дані</span>}
                <span className="badge">{data.classifier === "claude" ? "AI-аналіз" : "словниковий аналіз"}</span>
                {data.cached && <span className="badge">з кешу</span>}
              </div>
            </div>
            {total > 0 && (
              <div className="bar" role="img" aria-label="Розподіл тональності">
                {COLUMNS.map((c) =>
                  data.counts[c.key] > 0 ? (
                    <div
                      key={c.key}
                      className={`bar-seg seg-${c.key}`}
                      style={{ flexGrow: data.counts[c.key] }}
                      title={`${c.title}: ${data.counts[c.key]}`}
                    />
                  ) : null,
                )}
              </div>
            )}
            {data.notes.length > 0 && (
              <ul className="notes">
                {data.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}
          </section>

          <section className="grid">
            {COLUMNS.map((c) => (
              <Column
                key={c.key}
                sentiment={c.key}
                title={c.title}
                mark={c.emoji}
                count={data.counts[c.key]}
                pct={total ? Math.round((data.counts[c.key] / total) * 100) : 0}
                posts={data.posts[c.key]}
              />
            ))}
          </section>
        </>
      )}
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
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? props.posts : props.posts.slice(0, 5);

  return (
    <div className={`col col-${props.sentiment}`}>
      <div className="col-head">
        <span className="col-mark">{props.mark}</span>
        <span className="col-title">{props.title}</span>
      </div>
      <div className="col-count">
        {props.count}
        <span className="col-pct">{props.pct}%</span>
      </div>
      <div className="col-label">
        {props.count} {plural(props.count)}
      </div>

      <ul className="posts">
        {visible.map((p) => (
          <li key={p.id} className="post">
            <p className="post-text">{p.text}</p>
            <div className="post-meta">
              {p.username && <span>@{p.username}</span>}
              {p.timestamp && <span>{formatDate(p.timestamp)}</span>}
              {p.permalink && (
                <a href={p.permalink} target="_blank" rel="noopener noreferrer">
                  відкрити ↗
                </a>
              )}
            </div>
          </li>
        ))}
        {props.posts.length === 0 && <li className="empty">Немає згадок</li>}
      </ul>

      {props.posts.length > 5 && (
        <button type="button" className="more" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "Згорнути" : `Показати всі (${props.posts.length})`}
        </button>
      )}
    </div>
  );
}
