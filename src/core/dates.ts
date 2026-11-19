import { addDays, format, getDaysInMonth, isAfter, parseISO, startOfDay } from "date-fns";
import type { Locale } from "./types";

/**
 * Локальный ключ календарного дня в формате YYYY-MM-DD.
 * Используем date-fns format, а не toISOString(): иначе день смещается из-за часового пояса.
 */
export function toDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/** Ключ сегодняшнего (локального) дня. */
export function todayKey(now: Date = new Date()): string {
  return toDateKey(startOfDay(now));
}

/** Разбор ключа YYYY-MM-DD в локальную дату (noon, чтобы не «скакать» на границе суток). */
export function keyToDateTime(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0, 0);
}

export function keyToDate(key: string): Date {
  return parseISO(key);
}

/** Сдвиг ключа на n дней (локально). */
export function addDaysKey(key: string, n: number): string {
  return toDateKey(addDays(keyToDateTime(key), n));
}

/** Все ключи дней от from включительно до to включительно. */
export function eachDayKey(from: string, to: string): string[] {
  const out: string[] = [];
  const start = keyToDateTime(from);
  const end = keyToDateTime(to);
  if (isAfter(start, end)) return out;
  let cur = start;
  while (!isAfter(cur, end)) {
    out.push(toDateKey(cur));
    cur = addDays(cur, 1);
  }
  return out;
}

export function daysInMonth(year: number, monthIndex: number): number {
  return getDaysInMonth(new Date(year, monthIndex, 1, 12));
}

export function monthKey(year: number, monthIndex: number, day: number): string {
  return toDateKey(new Date(year, monthIndex, day, 12));
}

/** Первый и последний день месяца. */
export function monthRange(year: number, monthIndex: number): { from: string; to: string } {
  return {
    from: monthKey(year, monthIndex, 1),
    to: monthKey(year, monthIndex, daysInMonth(year, monthIndex)),
  };
}

/** Первый и последний день календарного года. */
export function yearRange(year: number): { from: string; to: string } {
  return {
    from: `${year}-01-01`,
    to: `${year}-12-31`,
  };
}

/** Последние n дней, ending today включительно. */
export function lastDaysRange(today: string, n: number): { from: string; to: string } {
  return { from: addDaysKey(today, -(n - 1)), to: today };
}

export function isFutureKey(key: string, today: string): boolean {
  return keyToDateTime(key).getTime() > keyToDateTime(today).getTime();
}

/* ——— локализованные названия ——— */

type MonthNames = {
  genitive: string[];
  nominative: string[];
  short: string[];
};

const MONTHS: Record<Locale, MonthNames> = {
  ru: {
    genitive: [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря",
    ],
    nominative: [
      "январь", "февраль", "март", "апрель", "май", "июнь",
      "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь",
    ],
    short: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
  },
  uk: {
    genitive: [
      "січня", "лютого", "березня", "квітня", "травня", "червня",
      "липня", "серпня", "вересня", "жовтня", "листопада", "грудня",
    ],
    nominative: [
      "січень", "лютий", "березень", "квітень", "травень", "червень",
      "липень", "серпень", "вересень", "жовтень", "листопад", "грудень",
    ],
    short: ["січ", "лют", "бер", "кві", "тра", "чер", "лип", "сер", "вер", "жов", "лис", "гру"],
  },
  en: {
    genitive: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    nominative: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
};

const WEEKDAYS: Record<Locale, { long: string[]; short: string[] }> = {
  ru: {
    long: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
    short: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
  },
  uk: {
    long: ["неділя", "понеділок", "вівторок", "середа", "четвер", "п'ятниця", "субота"],
    short: ["нд", "пн", "вт", "ср", "чт", "пт", "сб"],
  },
  en: {
    long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    short: ["su", "mo", "tu", "we", "th", "fr", "sa"],
  },
};

export function formatDayLong(key: string, locale: Locale = "ru"): string {
  const d = keyToDateTime(key);
  const wd = WEEKDAYS[locale].long[d.getDay()];
  const month = MONTHS[locale].genitive[d.getMonth()];
  const date = locale === "en" ? `${month} ${d.getDate()}` : `${d.getDate()} ${month}`;
  return locale === "en" ? `${wd}, ${date} ${d.getFullYear()}` : `${wd}, ${date} ${d.getFullYear()}`;
}

export function formatDayShort(key: string, locale: Locale = "ru"): string {
  const d = keyToDateTime(key);
  const month = MONTHS[locale].genitive[d.getMonth()];
  return locale === "en" ? `${month} ${d.getDate()}` : `${d.getDate()} ${month}`;
}

export function formatMonthYear(key: string, locale: Locale = "ru"): string {
  const d = keyToDateTime(key);
  return `${MONTHS[locale].nominative[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatMonthTitle(year: number, monthIndex: number, locale: Locale = "ru"): string {
  const name = MONTHS[locale].nominative[monthIndex] ?? "";
  const shown = name ? `${name[0].toUpperCase()}${name.slice(1)}` : "";
  return `${shown} ${year}`;
}

export function formatMonthName(monthIndex: number, locale: Locale = "ru"): string {
  const name = MONTHS[locale].nominative[monthIndex] ?? "";
  return name ? `${name[0].toUpperCase()}${name.slice(1)}` : "";
}

export function formatMonthShort(monthIndex: number, locale: Locale = "ru"): string {
  return MONTHS[locale].short[monthIndex] ?? "";
}

/** «пн», «вт» … для заголовка сетки (понедельник первым). */
export function weekdayHeaders(
  locale: Locale = "ru"
): { short: string; long: string; weekend: boolean }[] {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const { long, short } = WEEKDAYS[locale];
  return order.map((i) => ({
    short: short[i],
    long: long[i],
    weekend: i === 0 || i === 6,
  }));
}

/** Понедельник недели, в которой находится key. */
export function weekStartOnMonday(key: string): string {
  const d = keyToDateTime(key);
  const shift = (d.getDay() + 6) % 7;
  return addDaysKey(key, -shift);
}
