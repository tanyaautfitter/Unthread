/**
 * Дані власника сайту для футера та юридичних сторінок.
 * ЗАМІНІТЬ значення у квадратних дужках на свої перед публікацією.
 * Можна також задати через змінні оточення NEXT_PUBLIC_*.
 */
export const site = {
  name: "Unthread",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://unthread.example.com",
  /** Хто є власником (володільцем) персональних даних: ФОП або компанія */
  operator: process.env.NEXT_PUBLIC_OPERATOR || "[ФОП Прізвище Ім'я По батькові]",
  city: process.env.NEXT_PUBLIC_OPERATOR_CITY || "Київ, Україна",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "privacy@unthread.example.com",
  /** Дата набрання чинності політик */
  effectiveDate: "17 листопада 2026 р.",
  year: 2026,
};
