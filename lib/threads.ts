import type { ThreadsPost } from "./types";

const GRAPH = "https://graph.threads.net/v1.0";
const FIELDS = "id,text,username,permalink,timestamp,media_type";

export type ThreadsErrorKind = "network" | "auth" | "permission" | "rate" | "other";

export class ThreadsError extends Error {
  constructor(
    public kind: ThreadsErrorKind,
    public detail = "",
    public status = 502,
  ) {
    super(`${kind}: ${detail}`);
  }
}

interface ThreadsPage {
  data?: Array<{ id: string; text?: string; username?: string; permalink?: string; timestamp?: string }>;
  paging?: { next?: string; cursors?: { after?: string } };
  error?: { message?: string; code?: number; type?: string; error_subcode?: number; error_user_title?: string };
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
      throw new ThreadsError("network", "", 503);
    }
    const body = (await res.json().catch(() => ({}))) as ThreadsPage;

    if (!res.ok || body.error) {
      const e = body.error;
      const msg = [e?.message ?? `HTTP ${res.status}`, e?.error_user_title, e?.code && `code ${e.code}`, e?.error_subcode && `subcode ${e.error_subcode}`]
        .filter(Boolean)
        .join(" · ");
      if (e?.code === 10) {
        throw new ThreadsError("permission", msg, 403);
      }
      if (res.status === 401 || body.error?.code === 190) {
        throw new ThreadsError("auth", msg, 401);
      }
      if (body.error?.code === 4 || body.error?.code === 17 || res.status === 429) {
        throw new ThreadsError("rate", msg, 429);
      }
      throw new ThreadsError("other", msg);
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
