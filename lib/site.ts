/**
 * Дані власника сайту для футера та юридичних сторінок.
 * ЗАМІНІТЬ значення у квадратних дужках на свої перед публікацією.
 * Можна також задати через змінні оточення NEXT_PUBLIC_*.
 */
export const site = {
  name: "Hovir",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.hovir.live",
  /** Хто є власником (володільцем) персональних даних: ФОП або компанія */
  operator: process.env.NEXT_PUBLIC_OPERATOR || "[ФОП Прізвище Ім'я По батькові]",
  city: process.env.NEXT_PUBLIC_OPERATOR_CITY || "Київ, Україна",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "privacy@hovir.live",
  /** Дата набрання чинності політик */
  effectiveDate: "17 листопада 2026 р.",
  year: 2026,
};
