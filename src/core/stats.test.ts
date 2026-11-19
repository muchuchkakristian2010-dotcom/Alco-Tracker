import { describe, expect, it } from "vitest";
import * as webStats from "./stats";
import * as expoStats from "../../mobile/src/core/stats";
import type { DayRecord, DayStatus } from "./types";

const rec = (date: string, status: DayStatus): DayRecord => ({
  date,
  status,
  note: null,
  updated_at: 0,
});

type StatsModule = typeof webStats;

function spec(label: string, s: StatsModule) {
  describe(`${label}: статистика`, () => {
    it("считает дни с алкоголем, без алкоголя и неотмеченные", () => {
      const records = [
        rec("2026-05-01", "alcohol_free"),
        rec("2026-05-02", "alcohol_free"),
        rec("2026-05-03", "alcohol"),
        rec("2026-05-06", "alcohol_free"),
      ];
      const stats = s.computePeriodStats(records, "2026-05-01", "2026-05-07");
      expect(stats.total).toBe(7);
      expect(stats.alcoholFree).toBe(3);
      expect(stats.alcohol).toBe(1);
      expect(stats.unmarked).toBe(3);
      expect(stats.alcohol + stats.alcoholFree + stats.unmarked).toBe(stats.total);
    });

    it("пустая история — все дни неотмеченные", () => {
      const stats = s.computePeriodStats([], "2026-05-01", "2026-05-07");
      expect(stats).toMatchObject({ total: 7, alcohol: 0, alcoholFree: 0, unmarked: 7 });
    });

    it("неотмеченный день не попадает в дни без алкоголя", () => {
      const stats = s.computePeriodStats([], "2026-05-01", "2026-05-31");
      expect(stats.alcoholFree).toBe(0);
      expect(stats.unmarked).toBe(31);
    });

    it("диапазон недели — 7 дней, ending сегодня", () => {
      const range = s.resolveRange("week", "2026-05-12");
      expect(range.from).toBe("2026-05-06");
      expect(range.to).toBe("2026-05-12");
      const stats = s.computePeriodStats([], range.from, range.to);
      expect(stats.total).toBe(7);
    });

    it("диапазон месяца — весь текущий календарный месяц", () => {
      const range = s.resolveRange("month", "2026-02-10", new Date(2026, 1, 10, 12));
      expect(range.from).toBe("2026-02-01");
      expect(range.to).toBe("2026-02-28");
      expect(s.computePeriodStats([], range.from, range.to).total).toBe(28);
    });

    it("диапазон года и помесячная сводка за 12 месяцев", () => {
      const range = s.resolveRange("year", "2026-05-12");
      expect(range.from).toBe("2026-01-01");
      expect(range.to).toBe("2026-12-31");

      const records = [
        rec("2026-01-01", "alcohol_free"),
        rec("2026-01-02", "alcohol_free"),
        rec("2026-05-10", "alcohol"),
      ];
      const yearStats = s.computeYearStats(records, 2026);
      expect(yearStats.total).toBe(365);
      expect(yearStats.alcoholFree).toBe(2);
      expect(yearStats.alcohol).toBe(1);
      expect(yearStats.unmarked).toBe(362);

      const monthly = s.computeYearMonthlyStats(records, 2026);
      expect(monthly).toHaveLength(12);
      expect(monthly[0]).toMatchObject({ monthIndex: 0, total: 31, alcoholFree: 2, alcohol: 0, unmarked: 29 });
      expect(monthly[4]).toMatchObject({ monthIndex: 4, total: 31, alcoholFree: 0, alcohol: 1, unmarked: 30 });
    });

    it("записи вне диапазона не учитываются", () => {
      const records = [rec("2026-04-30", "alcohol"), rec("2026-05-01", "alcohol_free")];
      const stats = s.computePeriodStats(records, "2026-05-01", "2026-05-01");
      expect(stats).toMatchObject({ total: 1, alcohol: 0, alcoholFree: 1, unmarked: 0 });
    });

    it("доля в процентах", () => {
      expect(s.share(3, 7)).toBe(43);
      expect(s.share(0, 0)).toBe(0);
    });
  });
}

spec("веб", webStats);
spec("expo", expoStats);
