export type Lang = "uk" | "en";

export const LANG_COOKIE = "lang";

/** Мови браузера, для яких за замовчуванням показуємо українську версію */
const UK_LANGS = new Set(["uk", "ru", "be", "kk"]);
/** Країни за IP, для яких за замовчуванням показуємо українську версію */
const UK_COUNTRIES = new Set(["UA", "RU", "BY", "KZ"]);

/** Найпріоритетніша мова з заголовка Accept-Language, напр. "uk-UA,uk;q=0.9,en;q=0.8" → "uk" */
function primaryLanguage(acceptLanguage: string | null): string | null {
  if (!acceptLanguage) return null;
  const items = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number.parseFloat(q.split("=")[1]) : 1 };
    })
    .filter((x) => x.tag && x.tag !== "*" && !Number.isNaN(x.q))
    .sort((a, b) => b.q - a.q);
  return items[0]?.tag.split("-")[0] ?? null;
}

/**
 * Порядок: явний вибір користувача (cookie) → мова браузера → країна за IP → англійська.
 * Країну визначає Vercel (заголовок x-vercel-ip-country), сама IP-адреса не зберігається.
 */
export function detectLang(opts: {
  cookie?: string | null;
  acceptLanguage?: string | null;
  country?: string | null;
}): Lang {
  if (opts.cookie === "uk" || opts.cookie === "en") return opts.cookie;
  const lang = primaryLanguage(opts.acceptLanguage ?? null);
  if (lang && UK_LANGS.has(lang)) return "uk";
  const country = opts.country?.toUpperCase();
  if (country && UK_COUNTRIES.has(country)) return "uk";
  return "en";
}

export function mentions(n: number, lang: Lang): string {
  if (lang === "en") return n === 1 ? "mention" : "mentions";
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 >= 1 && m10 <= 4 && (m100 < 11 || m100 > 14)) return "згадування";
  return "згадувань";
}

export const dict = {
  uk: {
    metaTitle: "Hovir — що кажуть про бренд у Threads",
    metaDescription:
      "Введіть назву бренду й дізнайтеся, скільки позитивних, негативних і нейтральних згадок про нього в Threads.",
    heading: "Говір про бренд у Threads",
    suggestions: ["Adore Shoes", "Укрзалізниця", "Бажане", "Autfitter", "One by One", "Cher17", "Estro"],
    placeholder: "Назва бренду",
    search: "Пошук",
    searching: "Пошук…",
    tryLabel: "Спробуйте:",
    minChars: "Введіть щонайменше 2 символи.",
    genericError: "Щось пішло не так.",
    nothingFound: "нічого не знайдено",
    negative: "Негативні",
    positive: "Позитивні",
    neutral: "Нейтральні",
    noMentions: "Немає згадок",
    open: "відкрити ↗",
    collapse: "Згорнути",
    seeMore: "Подивитись ще",
    dateLocale: "uk-UA",
    footerDocs: "Документи",
    footerContacts: "Контакти",
    privacy: "Політика конфіденційності",
    terms: "Умови використання",
    cookies: "Політика файлів cookie",
    disclaimer: "Threads є торговою маркою Meta Platforms, Inc. Сайт взагалі ніяк не пов'язаний з Meta.",
    langLabel: "Мова",
    backHome: "← На головну",
    effective: "Набирає чинності",
    revised: "Остання редакція",
    effectiveDate: "17 листопада 2026 р.",
  },
  en: {
    metaTitle: "Hovir — what people say about a brand on Threads",
    metaDescription:
      "Enter a brand name to see how many positive, negative and neutral mentions it has on Threads.",
    heading: "What are people saying about a brand on Threads?",
    suggestions: ["Paris Texas", "Nude Project", "Autfitter", "Alo", "Lounge Nine", "Wang"],
    placeholder: "Brand name",
    search: "Search",
    searching: "Searching…",
    tryLabel: "Try:",
    minChars: "Enter at least 2 characters.",
    genericError: "Something went wrong.",
    nothingFound: "nothing found",
    negative: "Negative",
    positive: "Positive",
    neutral: "Neutral",
    noMentions: "No mentions",
    open: "open ↗",
    collapse: "Show less",
    seeMore: "See more",
    dateLocale: "en-GB",
    footerDocs: "Documents",
    footerContacts: "Contacts",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    cookies: "Cookie Policy",
    disclaimer: "Threads is a trademark of Meta Platforms, Inc. This site is in no way affiliated with Meta.",
    langLabel: "Language",
    backHome: "← Back to home",
    effective: "Effective",
    revised: "Last updated",
    effectiveDate: "17 November 2026",
  },
} as const;

export type Dict = (typeof dict)[Lang];
