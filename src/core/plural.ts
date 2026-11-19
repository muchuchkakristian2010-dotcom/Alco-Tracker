import type { Locale } from "./types";

export type PluralForms = [string, string, string];

/** Склонение по трём формам: день / дня / дней (для en — день/дни). */
export function plural(n: number, forms: PluralForms, locale: Locale = "ru"): string {
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (locale === "en") {
    return n === 1 ? forms[0] : forms[1];
  }

  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (locale === "uk") {
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
    return forms[2];
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

const DAY_FORMS: Record<Locale, PluralForms> = {
  ru: ["день", "дня", "дней"],
  uk: ["день", "дні", "днів"],
  en: ["day", "days", "days"],
};

export function daysWord(n: number, locale: Locale = "ru"): string {
  return plural(n, DAY_FORMS[locale], locale);
}

/** Совместимость со старым вызовом daysWord(n) / pluralRu(n, forms). */
export function pluralRu(n: number, forms: PluralForms): string {
  return plural(n, forms, "ru");
}
