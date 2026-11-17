import { NextRequest, NextResponse } from "next/server";
import { searchThreads, ThreadsError, type ThreadsErrorKind } from "@/lib/threads";
import type { Lang } from "@/lib/i18n";

const MESSAGES: Record<Lang, Record<ThreadsErrorKind | "input" | "busy" | "server", string>> = {
  uk: {
    input: "Введіть назву бренду (від 2 до 80 символів).",
    busy: "Забагато запитів. Спробуйте за хвилину.",
    server: "Внутрішня помилка сервера.",
    network: "Не вдалося з'єднатися з Threads. Спробуйте пізніше.",
    auth: "Threads: недійсний або прострочений токен.",
    permission: "Threads: у токена немає дозволу на пошук. Згенеруйте токен заново з дозволом threads_keyword_search.",
    rate: "Threads: вичерпано ліміт пошукових запитів. Спробуйте пізніше.",
    other: "Помилка Threads API.",
  },
  en: {
    input: "Enter a brand name (2 to 80 characters).",
    busy: "Too many requests. Please try again in a minute.",
    server: "Internal server error.",
    network: "Could not connect to Threads. Please try again later.",
    auth: "Threads: the access token is invalid or expired.",
    permission: "Threads: the token has no search permission. Generate a new token with threads_keyword_search.",
    rate: "Threads: the search rate limit has been reached. Please try again later.",
    other: "Threads API error.",
  },
};
import { classifyWithClaude, classifyWithLexicon, type Label } from "@/lib/sentiment";
import { cacheGet, cacheSet, rateLimited } from "@/lib/cache";
import { demoPosts } from "@/lib/demo";
import type { AnalyzeResult, ClassifiedPost, Sentiment, ThreadsPost } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const env = {
  threadsToken: process.env.THREADS_ACCESS_TOKEN?.trim() || "",
  anthropicKey: process.env.ANTHROPIC_API_KEY?.trim() || "",
  model: process.env.ANTHROPIC_MODEL?.trim() || "claude-haiku-5-5",
  maxPosts: clampInt(process.env.MAX_POSTS, 100, 10, 500),
  searchType: (process.env.THREADS_SEARCH_TYPE?.toUpperCase() === "TOP" ? "TOP" : "RECENT") as "TOP" | "RECENT",
  cacheTtl: clampInt(process.env.CACHE_TTL_SECONDS, 3600, 0, 86400),
  rateLimit: clampInt(process.env.RATE_LIMIT_PER_MINUTE, 10, 1, 1000),
};

function clampInt(v: string | undefined, def: number, min: number, max: number): number {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def;
}

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}

export async function GET(req: NextRequest) {
  const brand = (req.nextUrl.searchParams.get("q") ?? "").trim().replace(/\s+/g, " ");
  const lang: Lang = req.nextUrl.searchParams.get("lang") === "en" ? "en" : "uk";
  const m = MESSAGES[lang];

  if (brand.length < 2 || brand.length > 80) {
    return NextResponse.json({ error: m.input }, { status: 400 });
  }

  const cacheKey = `${env.searchType}:${brand.toLowerCase()}`;
  const cached = cacheGet<AnalyzeResult>(cacheKey);
  if (cached) return NextResponse.json({ ...cached, cached: true });

  if (rateLimited(clientIp(req), env.rateLimit)) {
    return NextResponse.json({ error: m.busy }, { status: 429 });
  }

  const notes: string[] = [];
  let posts: ThreadsPost[];
  let source: AnalyzeResult["source"];

  try {
    if (env.threadsToken) {
      const r = await searchThreads(brand, {
        token: env.threadsToken,
        maxPosts: env.maxPosts,
        searchType: env.searchType,
      });
      posts = r.posts;
      source = "threads";
      notes.push(
        `Проаналізовано ${posts.length} ${env.searchType === "RECENT" ? "найновіших" : "найпопулярніших"} публічних постів (запитів до Threads: ${r.requests}).`,
      );
    } else {
      posts = demoPosts(brand);
      source = "demo";
      notes.push("Демо-режим: THREADS_ACCESS_TOKEN не задано, показано вигадані пости.");
    }

    let labels: Map<string, Label>;
    let classifier: AnalyzeResult["classifier"];
    if (posts.length === 0) {
      labels = new Map();
      classifier = env.anthropicKey ? "claude" : "lexicon";
    } else if (env.anthropicKey) {
      try {
        labels = await classifyWithClaude(brand, posts, { apiKey: env.anthropicKey, model: env.model });
        classifier = "claude";
      } catch (e) {
        console.error("Claude classification failed, falling back to lexicon:", e);
        labels = classifyWithLexicon(posts);
        classifier = "lexicon";
        notes.push("Claude API недоступний — використано спрощений словниковий аналіз.");
      }
    } else {
      labels = classifyWithLexicon(posts);
      classifier = "lexicon";
      notes.push("ANTHROPIC_API_KEY не задано — використано спрощений словниковий аналіз (менш точний).");
    }

    const buckets: Record<Sentiment, ClassifiedPost[]> = { positive: [], negative: [], neutral: [] };
    let irrelevant = 0;
    for (const p of posts) {
      const label = labels.get(p.id) ?? "neutral";
      if (label === "irrelevant") {
        irrelevant++;
        continue;
      }
      buckets[label].push({ ...p, sentiment: label });
    }
    if (irrelevant > 0) notes.push(`${irrelevant} постів відкинуто: слово вжито не в значенні бренду.`);
    if (source === "threads" && posts.length === 0) {
      notes.push("Нічого не знайдено. Спробуйте коротший запит або іншу форму назви.");
    }

    const result: AnalyzeResult = {
      brand,
      analyzedAt: new Date().toISOString(),
      totalFetched: posts.length,
      irrelevant,
      counts: {
        positive: buckets.positive.length,
        negative: buckets.negative.length,
        neutral: buckets.neutral.length,
      },
      posts: buckets,
      source,
      classifier,
      cached: false,
      notes,
    };

    if (env.cacheTtl > 0) cacheSet(cacheKey, result, env.cacheTtl);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof ThreadsError) {
      const detail = e.detail ? ` (${e.detail})` : "";
      return NextResponse.json({ error: m[e.kind] + detail }, { status: e.status });
    }
    console.error(e);
    return NextResponse.json({ error: m.server }, { status: 500 });
  }
}
