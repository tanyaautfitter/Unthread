import type { ThreadsPost } from "./types";

/**
 * Демо-дані для запуску без токена Threads.
 * Тексти вигадані, імена користувачів умовні.
 */
const TEMPLATES = [
  "Купив {b} тиждень тому — чесно, найкращий досвід за довгий час. Рекомендую 🔥",
  "{b} знову підняли ціни, а якість гірша. Розчарований 👎",
  "Хтось знає, чи є {b} в Києві офлайн-магазин?",
  "Підтримка {b} відповіла за 5 хвилин і все вирішила. Дякую!",
  "Замовлення від {b} прийшло зламаним, повернення вже третій тиждень. Жах.",
  "{b} анонсували нову колекцію на наступний місяць.",
  "Love my new {b} stuff, honestly amazing quality ❤",
  "Never again ordering from {b}. Terrible customer service, still waiting for a refund.",
  "Is {b} worth it or just hype? Thinking about trying it",
  "{b} — топ за свої гроші, зручно і якісно",
  "Не раджу {b}: через місяць не працює",
  "Бачила рекламу {b} у метро сьогодні",
  "{b} app keeps crashing after the update, useless 😡",
  "Our team switched to {b} last quarter, great decision",
  "Порівнюю {b} з конкурентами, поки не визначився",
  "Обожнюю {b}, вже третя покупка 😍",
  "{b} відкрили вакансії в Львові",
  "Customer support at {b} was okay, nothing special",
];

const USERS = ["kyiv_daily", "olena.m", "andrii_tech", "maria.style", "dev_ostap", "lviv_coffee", "nazar.k", "sofia_reviews", "max_ua", "iryna.p"];

export function demoPosts(brand: string): ThreadsPost[] {
  const now = Date.now();
  return TEMPLATES.map((t, i) => {
    const id = `demo_${i + 1}`;
    return {
      id,
      text: t.replaceAll("{b}", brand),
      username: USERS[i % USERS.length],
      permalink: undefined,
      timestamp: new Date(now - i * 3_600_000 * 5).toISOString(),
    };
  });
}
