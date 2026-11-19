import { addDaysKey, eachDayKey, monthRange, yearRange } from "./dates";
import { toRecordMap } from "./streaks";
import type { DayRecord } from "./types";

export interface PeriodStats {
  from: string;
  to: string;
  total: number;
  alcohol: number;
  alcoholFree: number;
  /** Дни, которые пользователь не отмечал. Не считаются днями без алкоголя. */
  unmarked: number;
}

export interface MonthBucketStats extends PeriodStats {
  year: number;
  monthIndex: number;
}

/**
 * Считает статистику за произвольный диапазон дат (включительно).
 * Отсутствующая запись — «не отмечено».
 */
export function computePeriodStats(
  records: ReadonlyArray<DayRecord>,
  from: string,
  to: string
): PeriodStats {
  const map = toRecordMap(records);
  const days = eachDayKey(from, to);
  let alcohol = 0;
  let alcoholFree = 0;
  let unmarked = 0;

  for (const key of days) {
    const rec = map.get(key);
    if (!rec) unmarked += 1;
    else if (rec.status === "alcohol") alcohol += 1;
    else alcoholFree += 1;
  }

  return { from, to, total: days.length, alcohol, alcoholFree, unmarked };
}

/** Сводная статистика за весь календарный год. */
export function computeYearStats(
  records: ReadonlyArray<DayRecord>,
  year: number
): PeriodStats {
  const { from, to } = yearRange(year);
  return computePeriodStats(records, from, to);
}

/** Помесячная статистика за все 12 месяцев выбранного года. */
export function computeYearMonthlyStats(
  records: ReadonlyArray<DayRecord>,
  year: number
): MonthBucketStats[] {
  return Array.from({ length: 12 }, (_, monthIndex) => {
    const { from, to } = monthRange(year, monthIndex);
    const stats = computePeriodStats(records, from, to);
    return {
      ...stats,
      year,
      monthIndex,
    };
  });
}

export type PeriodKind = "week" | "month" | "year";
export type PeriodLabelKey = "last7" | "thisMonth" | "thisYear";

/**
 * Неделя — последние 7 календарных дней, включая сегодня.
 * Месяц — текущий календарный месяц. Год — текущий календарный год.
 * `label` — русская подпись (для совместимости), `labelKey` — ключ для локализации.
 */
export function resolveRange(kind: PeriodKind, today: string, _now: Date = new Date()): {
  from: string;
  to: string;
  label: string;
  labelKey: PeriodLabelKey;
} {
  if (kind === "week") {
    return { from: addDaysKey(today, -6), to: today, label: "последние 7 дней", labelKey: "last7" };
  }
  if (kind === "year") {
    const year = Number(today.slice(0, 4));
    const { from, to } = yearRange(year);
    return { from, to, label: "текущий год", labelKey: "thisYear" };
  }
  const year = Number(today.slice(0, 4));
  const monthIndex = Number(today.slice(5, 7)) - 1;
  const lastDay = new Date(year, monthIndex + 1, 0, 12).getDate();
  const from = `${today.slice(0, 7)}-01`;
  const to = `${today.slice(0, 7)}-${String(lastDay).padStart(2, "0")}`;
  return { from, to, label: "текущий месяц", labelKey: "thisMonth" };
}

export function share(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}
