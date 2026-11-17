import Anthropic from "@anthropic-ai/sdk";
import type { Sentiment, ThreadsPost } from "./types";

export type Label = Sentiment | "irrelevant";

const BATCH_SIZE = 25;

const SYSTEM = `You are a brand-reputation analyst. For each social media post you receive, decide the author's sentiment TOWARDS THE GIVEN BRAND specifically (not the general mood of the post).

Labels:
- "positive": praise, recommendation, satisfaction, excitement about the brand or its products.
- "negative": complaint, criticism, disappointment, warning others, sarcasm aimed at the brand.
- "neutral": news, questions, factual mentions, ads, mixed or unclear attitude.
- "irrelevant": the word matches but refers to something else (e.g. "apple" the fruit when the brand is Apple Inc.).

Posts may be in any language (Ukrainian, English, Russian, etc.) and may contain slang, emojis and irony — interpret them like a native speaker.

Reply with ONLY a JSON array, no prose: [{"id":"<post id>","label":"positive|negative|neutral|irrelevant"}, ...]. Include every post id exactly once.`;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export function parseLabels(raw: string): Map<string, Label> {
  const map = new Map<string, Label>();
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start === -1 || end === -1) return map;
  try {
    const arr = JSON.parse(raw.slice(start, end + 1)) as Array<{ id?: unknown; label?: unknown }>;
    for (const item of arr) {
      const id = String(item.id ?? "");
      const label = String(item.label ?? "").toLowerCase();
      if (id && ["positive", "negative", "neutral", "irrelevant"].includes(label)) {
        map.set(id, label as Label);
      }
    }
  } catch {
    /* повернемо те, що вдалося розпарсити (нічого) */
  }
  return map;
}

/** Класифікація через Claude: пости відправляються пачками паралельно. */
export async function classifyWithClaude(
  brand: string,
  posts: ThreadsPost[],
  opts: { apiKey: string; model: string },
): Promise<Map<string, Label>> {
  const client = new Anthropic({ apiKey: opts.apiKey });
  const result = new Map<string, Label>();

  const batches = chunk(posts, BATCH_SIZE);
  const responses = await Promise.all(
    batches.map(async (batch) => {
      const payload = batch.map((p) => ({ id: p.id, text: p.text.slice(0, 1500) }));
      const msg = await client.messages.create({
        model: opts.model,
        max_tokens: 2048,
        system: SYSTEM,
        messages: [
          {
            role: "user",
            content: `Brand: "${brand}"\n\nPosts (JSON):\n${JSON.stringify(payload)}`,
          },
        ],
      });
      const text = msg.content
        .map((b) => (b.type === "text" ? b.text : ""))
        .join("");
      return parseLabels(text);
    }),
  );

  for (const map of responses) for (const [id, label] of map) result.set(id, label);

  // Пости, для яких модель не повернула мітку, вважаємо нейтральними
  for (const p of posts) if (!result.has(p.id)) result.set(p.id, "neutral");
  return result;
}

/* ---------- Резервний класифікатор (без API-ключа) ---------- */

const POSITIVE = [
  // uk
  "люблю", "обожнюю", "чудов", "класн", "супер", "найкращ", "рекомендую", "задоволен", "вогонь", "топ", "дякую", "крут", "зручн", "якісн", "швидк",
  // ru
  "отличн", "рекомендую", "доволен", "лучш", "класс",
  // en
  "love", "great", "awesome", "amazing", "best", "recommend", "excellent", "perfect", "happy", "fantastic", "nice", "good",
  "❤", "😍", "🔥", "👍", "🥰",
];

const NEGATIVE = [
  // uk
  "жах", "погано", "погани", "розчаров", "не раджу", "не рекомендую", "зламав", "зламал", "обман", "гірш", "відстій", "повернення", "скарг", "огидн", "дорого", "не працює", "кошмар",
  // ru
  "ужас", "плохо", "разочаров", "сломал", "обман", "отстой", "не работает",
  // en
  "hate", "terrible", "awful", "worst", "bad", "broken", "scam", "disappoint", "refund", "never again", "useless", "poor", "overpriced",
  "😡", "🤬", "👎", "💩", "😤",
];

export function classifyWithLexicon(posts: ThreadsPost[]): Map<string, Label> {
  const result = new Map<string, Label>();
  for (const p of posts) {
    const t = p.text.toLowerCase();
    const pos = POSITIVE.filter((w) => t.includes(w)).length;
    const neg = NEGATIVE.filter((w) => t.includes(w)).length;
    result.set(p.id, neg > pos ? "negative" : pos > neg ? "positive" : "neutral");
  }
  return result;
}
