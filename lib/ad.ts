import type { Lang } from "./i18n";

/** Реклама власного застосунку Autfitter. Тексти й логотипи змінюються по черзі. */
export const autfitterAd = {
  name: "Autfitter",
  appStore: "https://apps.apple.com/ua/app/autfitter-outfit-planner/id6751246253?l=uk",
  googlePlay: "https://play.google.com/store/apps/details?id=com.autfitter.app&hl=en",
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
  cta: { uk: "Спробувати", en: "Try it" } satisfies Record<Lang, string>,
  close: { uk: "Закрити рекламу", en: "Close ad" } satisfies Record<Lang, string>,
  /** Через скільки мілісекунд після відкриття сторінки з'являється реклама */
  delayMs: 5000,
  /** Скільки мілісекунд показується кожен текст */
  intervalMs: 4000,
};
