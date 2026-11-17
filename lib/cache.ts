/**
 * Простий in-memory кеш з TTL. Економить ліміт запитів Threads і витрати на LLM.
 * Для кількох інстансів сервера замініть на Redis / Vercel KV.
 */
interface Entry<T> {
  value: T;
  expires: number;
}

const store = new Map<string, Entry<unknown>>();
const MAX_ENTRIES = 500;

export function cacheGet<T>(key: string): T | undefined {
  const e = store.get(key);
  if (!e) return undefined;
  if (Date.now() > e.expires) {
    store.delete(key);
    return undefined;
  }
  return e.value as T;
}

export function cacheSet<T>(key: string, value: T, ttlSeconds: number): void {
  if (store.size >= MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest !== undefined) store.delete(oldest);
  }
  store.set(key, { value, expires: Date.now() + ttlSeconds * 1000 });
}

/* ---------- Обмеження частоти запитів на IP ---------- */

const hits = new Map<string, number[]>();

export function rateLimited(ip: string, maxPerMinute: number): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > maxPerMinute;
}
