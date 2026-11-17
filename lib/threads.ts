import type { ThreadsPost } from "./types";

const GRAPH = "https://graph.threads.net/v1.0";
const FIELDS = "id,text,username,permalink,timestamp,media_type";

export class ThreadsError extends Error {
  constructor(message: string, public status = 502) {
    super(message);
  }
}

interface ThreadsPage {
  data?: Array<{ id: string; text?: string; username?: string; permalink?: string; timestamp?: string }>;
  paging?: { next?: string; cursors?: { after?: string } };
  error?: { message?: string; code?: number; type?: string };
}

/**
 * Шукає публічні пости Threads за ключовим словом.
 * Документація: https://developers.facebook.com/documentation/threads/keyword-search
 *
 * Важливо: без схваленого дозволу threads_keyword_search пошук іде лише
 * по постах власника токена. Кожен запит рахується в ліміт 2 200 запитів / 24 год.
 */
export async function searchThreads(
  query: string,
  opts: { token: string; maxPosts: number; searchType: "TOP" | "RECENT" },
): Promise<{ posts: ThreadsPost[]; requests: number }> {
  const posts: ThreadsPost[] = [];
  const seen = new Set<string>();
  let requests = 0;

  const params = new URLSearchParams({
    q: query,
    search_type: opts.searchType,
    fields: FIELDS,
    limit: String(Math.min(100, opts.maxPosts)),
    access_token: opts.token,
  });
  let url: string | undefined = `${GRAPH}/keyword_search?${params}`;

  // Обмежуємо кількість сторінок, щоб не спалити ліміт запитів
  const maxPages = Math.max(1, Math.ceil(opts.maxPosts / 25) + 1);

  while (url && posts.length < opts.maxPosts && requests < maxPages) {
    requests++;
    let res: Response;
    try {
      res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(15_000) });
    } catch {
      throw new ThreadsError("Не вдалося з'єднатися з Threads API. Спробуйте пізніше.", 503);
    }
    const body = (await res.json().catch(() => ({}))) as ThreadsPage;

    if (!res.ok || body.error) {
      const msg = body.error?.message ?? `HTTP ${res.status}`;
      if (res.status === 401 || body.error?.code === 190) {
        throw new ThreadsError(`Threads: недійсний або прострочений токен (${msg})`, 401);
      }
      if (body.error?.code === 4 || body.error?.code === 17 || res.status === 429) {
        throw new ThreadsError(`Threads: вичерпано ліміт пошукових запитів (${msg})`, 429);
      }
      throw new ThreadsError(`Threads API помилка: ${msg}`);
    }

    for (const p of body.data ?? []) {
      if (!p.text || seen.has(p.id)) continue;
      seen.add(p.id);
      posts.push({
        id: p.id,
        text: p.text,
        username: p.username,
        permalink: p.permalink,
        timestamp: p.timestamp,
      });
      if (posts.length >= opts.maxPosts) break;
    }

    if (!body.data?.length) break;
    url = body.paging?.next;
  }

  return { posts, requests };
}
