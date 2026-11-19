import { addDaysKey } from "./dates";
import { statusOn, type DayRecord, type DayStatus } from "./types";

/**
 * Правила расчёта серий (чистые функции, тестируются отдельно от UI и БД).
 *
 * 1. День засчитывается в серию только при явной отметке `alcohol_free`.
 * 2. День с алкоголем прерывает серию.
 * 3. Неотмеченный день тоже прерывает подтверждённую серию: мы не гадаем, что происходило.
 * 4. Если сегодня не отмечено — серия считается по отметкам до вчерашнего дня включительно.
 * 5. Если сегодня отмечен `alcohol` — текущая серия равна 0, лучшая из прошлого сохраняется.
 */

export function toRecordMap(records: ReadonlyArray<DayRecord>): Map<string, DayRecord> {
  const map = new Map<string, DayRecord>();
  for (const r of records) map.set(r.date, r);
  return map;
}

/**
 * Текущая подтверждённая серия дней без алкоголя на дату `today`.
 * Возвращает число дней подряд, отмеченных как `alcohol_free`, не заходя дальше
 * первого дня с алкоголем или первого неотмеченного дня.
 */
export function computeCurrentStreak(records: ReadonlyArray<DayRecord>, today: string): number {
  const map = toRecordMap(records);
  const todayStatus = statusOn(map, today);

  if (todayStatus === "alcohol") return 0;

  let count = 0;
  let cursor = todayStatus === "alcohol_free" ? today : addDaysKey(today, -1);

  while (true) {
    const status = statusOn(map, cursor);
    if (status !== "alcohol_free") break;
    count += 1;
    cursor = addDaysKey(cursor, -1);
  }
  return count;
}

/**
 * Самая длинная серия дней без алкоголя по всей истории (по всем непрерывным
 * участкам из последовательных ключей дат с отметкой `alcohol_free`).
 */
export function computeLongestStreak(records: ReadonlyArray<DayRecord>): number {
  const freeKeys = records
    .filter((r) => r.status === "alcohol_free")
    .map((r) => r.date)
    .sort();

  let best = 0;
  let run = 0;
  let prev: string | null = null;

  for (const key of freeKeys) {
    if (prev !== null && addDaysKey(prev, 1) === key) {
      run += 1;
    } else {
      run = 1;
    }
    if (run > best) best = run;
    prev = key;
  }
  return best;
}

/** Информация о текущей серии для экрана «Сегодня». */
export interface StreakInfo {
  /** Подтверждённая текущая серия. */
  current: number;
  /** Лучшая серия за всю историю. */
  longest: number;
  /** Отмечен ли сегодняшний день. */
  todayMarked: boolean;
  /** Статус сегодняшней отметки, если она есть. */
  todayStatus: DayStatus | null;
  /** Серия, посчитанная по дням до вчера (используется, когда сегодня ещё не отмечено). */
  upToYesterday: number;
}

export function getStreakInfo(records: ReadonlyArray<DayRecord>, today: string): StreakInfo {
  const map = toRecordMap(records);
  const status = map.get(today)?.status ?? null;

  /** серия, если считать начиная со вчерашнего дня (для сообщения «сегодня не отмечено») */
  let count = 0;
  let cursor = addDaysKey(today, -1);
  while (statusOn(map, cursor) === "alcohol_free") {
    count += 1;
    cursor = addDaysKey(cursor, -1);
  }

  return {
    current: computeCurrentStreak(records, today),
    longest: computeLongestStreak(records),
    todayMarked: status !== null,
    todayStatus: status,
    upToYesterday: count,
  };
}

/** Последние n дней по порядку с их статусами — для «нити» и ленты статистики. */
export function buildDaySequence(
  records: ReadonlyArray<DayRecord>,
  from: string,
  to: string
): { date: string; status: DayRecord["status"] | null }[] {
  const map = toRecordMap(records);
  const out: { date: string; status: DayStatus | null }[] = [];
  let cursor = from;
  // защита от некорректного диапазона
  for (let guard = 0; guard < 400; guard += 1) {
    const rec = map.get(cursor);
    out.push({ date: cursor, status: rec ? rec.status : null });
    if (cursor === to) break;
    cursor = addDaysKey(cursor, 1);
  }
  return out;
}
