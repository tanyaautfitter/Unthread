import type { Lang } from "./i18n";

/** Реклама власного застосунку Autfitter. Тексти й логотипи змінюються по черзі. */
export const autfitterAd = {
  name: "Autfitter",
  url: process.env.NEXT_PUBLIC_AUTFITTER_URL || "https://apps.apple.com/app/id6751246253",
  logos: [
    "/ads/autfitter-dark.png",
    "/ads/autfitter-red.png",
    "/ads/autfitter-light.png",
    "/ads/autfitter-leopard.png",
  ],
  texts: {
    uk: [
      "Твоя цифрова шафа в гардеробі",
      "Давай доступ стилістам через застосунок",
      "Забудь про імпульсивні покупки",
      "Максимум потенціалу твого гардеробу",
    ],
    en: [
      "The most productive wardrobe app ever made",
      "Adapt your services to new reality — style on the go",
      "Stylists access to clients' digital wardrobe",
      "Forget about background removal tools",
      "New services",
    ],
  } satisfies Record<Lang, string[]>,
  label: { uk: "Реклама", en: "Ad" } satisfies Record<Lang, string>,
  cta: { uk: "Завантажити", en: "Get the app" } satisfies Record<Lang, string>,
  /** Скільки мілісекунд показується кожен текст */
  intervalMs: 4000,
};
