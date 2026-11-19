import { describe, expect, it } from "vitest";
import * as web from "./streaks";
import * as expo from "../../mobile/src/core/streaks";
import { toDateKey, todayKey } from "./dates";
import type { DayRecord, DayStatus } from "./types";

type StreakModule = typeof web;

const rec = (date: string, status: DayStatus): DayRecord => ({
  date,
  status,
  note: null,
  updated_at: 0,
});

const free = (date: string) => rec(date, "alcohol_free");
const drink = (date: string) => rec(date, "alcohol");

/**
 * Один и тот же набор проверок выполняется над логикой веб-версии и над
 * логикой Expo-приложения: наборы кода должны совпадать по поведению.
 */
function spec(label: string, s: StreakModule) {
  describe(`${label}: расчёт серий`, () => {
    it("несколько подряд отмеченных дней без алкоголя", () => {
      const records = [free("2026-05-01"), free("2026-05-02"), free("2026-05-03")];
      expect(s.computeCurrentStreak(records, "2026-05-03")).toBe(3);
      expect(s.computeLongestStreak(records)).toBe(3);
      expect(s.computeCurrentStreak(records, "2026-05-02")).toBe(2);
    });

    it("день с алкоголем прерывает серию", () => {
      const records = [
        free("2026-05-01"),
        free("2026-05-02"),
        drink("2026-05-03"),
        free("2026-05-04"),
      ];
      expect(s.computeCurrentStreak(records, "2026-05-03")).toBe(0);
      expect(s.computeCurrentStreak(records, "2026-05-04")).toBe(1);
      expect(s.computeLongestStreak(records)).toBe(2);
    });

    it("неотмеченный день прерывает подтверждённую серию", () => {
      const records = [free("2026-05-01"), free("2026-05-03")];
      expect(s.computeCurrentStreak(records, "2026-05-03")).toBe(1);
      expect(s.computeLongestStreak(records)).toBe(1);
    });

    it("сегодня не отмечено — серия считается до вчерашнего дня", () => {
      const records = [
        free("2026-05-01"),
        free("2026-05-02"),
        free("2026-05-03"),
        free("2026-05-04"),
      ];
      const info = s.getStreakInfo(records, "2026-05-05");
      expect(info.todayMarked).toBe(false);
      expect(info.todayStatus).toBeNull();
      expect(info.current).toBe(4);
      expect(info.upToYesterday).toBe(4);
    });

    it("сегодня отмечен алкоголем — текущая серия 0, лучшая сохраняется", () => {
      const records = [
        free("2026-05-01"),
        free("2026-05-02"),
        free("2026-05-03"),
        drink("2026-05-04"),
      ];
      const info = s.getStreakInfo(records, "2026-05-04");
      expect(info.current).toBe(0);
      expect(info.longest).toBe(3);
      expect(info.todayStatus).toBe("alcohol");
    });

    it("изменение отметки пересчитывает серию", () => {
      const base = [
        free("2026-05-01"),
        free("2026-05-02"),
        free("2026-05-03"),
        free("2026-05-04"),
        free("2026-05-05"),
      ];
      expect(s.computeCurrentStreak(base, "2026-05-05")).toBe(5);

      const changed = base.map((r) =>
        r.date === "2026-05-04" ? { ...r, status: "alcohol" as DayStatus } : r
      );
      expect(s.computeCurrentStreak(changed, "2026-05-05")).toBe(1);
      expect(s.computeLongestStreak(changed)).toBe(3);
    });

    it("удаление отметки пересчитывает серию", () => {
      const base = [
        free("2026-05-01"),
        free("2026-05-02"),
        free("2026-05-03"),
        free("2026-05-04"),
        free("2026-05-05"),
      ];
      const withoutHole = base.filter((r) => r.date !== "2026-05-03");
      expect(s.computeCurrentStreak(withoutHole, "2026-05-05")).toBe(2);
      expect(s.computeLongestStreak(withoutHole)).toBe(2);

      const clearedToday = base.filter((r) => r.date !== "2026-05-05");
      expect(s.computeCurrentStreak(clearedToday, "2026-05-05")).toBe(4);
      expect(s.getStreakInfo(clearedToday, "2026-05-05").todayMarked).toBe(false);
    });

    it("пустая история — нули и пустая последовательность", () => {
      expect(s.computeCurrentStreak([], "2026-05-05")).toBe(0);
      expect(s.computeLongestStreak([])).toBe(0);
      expect(s.getStreakInfo([], "2026-05-05")).toEqual({
        current: 0,
        longest: 0,
        todayMarked: false,
        todayStatus: null,
        upToYesterday: 0,
      });
      expect(s.buildDaySequence([], "2026-05-01", "2026-05-07")).toHaveLength(7);
      expect(s.buildDaySequence([], "2026-05-01", "2026-05-07").every((d) => d.status === null)).toBe(
        true
      );
    });

    it("серия не простирается в будущее", () => {
      const records = [free("2026-05-10"), free("2026-05-11")];
      expect(s.computeCurrentStreak(records, "2026-05-09")).toBe(0);
      expect(s.computeLongestStreak(records)).toBe(2);
    });
  });
}

spec("веб", web);
spec("expo", expo);

describe("ключи локальной даты", () => {
  it("не сдвигает день из-за часового пояса (в отличие от toISOString)", () => {
    const lateEvening = new Date(2026, 4, 12, 23, 59, 0, 0);
    expect(toDateKey(lateEvening)).toBe("2026-05-12");
    const earlyMorning = new Date(2026, 4, 12, 0, 5, 0, 0);
    expect(toDateKey(earlyMorning)).toBe("2026-05-12");
    expect(todayKey(new Date(2026, 0, 1, 0, 0, 1))).toBe("2026-01-01");
  });
});
