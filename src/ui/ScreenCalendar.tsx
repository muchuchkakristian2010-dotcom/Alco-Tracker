import { useMemo, useState } from "react";
import {
  daysInMonth,
  formatDayShort,
  formatMonthName,
  formatMonthTitle,
  isFutureKey,
  keyToDateTime,
  monthKey,
  weekdayHeaders,
} from "../core/dates";
import { computePeriodStats, computeYearMonthlyStats, computeYearStats } from "../core/stats";
import { daysWord } from "../core/plural";
import type { DayRecord, DayView } from "../core/types";
import { useI18n } from "../i18n/context";
import type { AppData } from "../app/store";
import { Rubric } from "./bits";
import { BottleIcon, ChevronIcon, LeafIcon, StatusGlyph } from "./Icons";
import { Legend } from "./DayEditor";

type CalendarMode = "month" | "year";

export function ScreenCalendar({ data, onOpenDay }: { data: AppData; onOpenDay: (date: string) => void }) {
  const { t, locale, fmt: f } = useI18n();
  const { today, map, records } = data;
  const todayDate = keyToDateTime(today);
  const [mode, setMode] = useState<CalendarMode>("month");
  const [cursor, setCursor] = useState(() => ({
    year: todayDate.getFullYear(),
    month: todayDate.getMonth(),
  }));
  const [slide, setSlide] = useState<1 | -1>(1);

  const monthStart = monthKey(cursor.year, cursor.month, 1);
  const monthEnd = monthKey(cursor.year, cursor.month, daysInMonth(cursor.year, cursor.month));
  const stats = useMemo(() => computePeriodStats(records, monthStart, monthEnd), [records, monthStart, monthEnd]);

  const yearStats = useMemo(() => computeYearStats(records, cursor.year), [records, cursor.year]);
  const yearMonths = useMemo(() => computeYearMonthlyStats(records, cursor.year), [records, cursor.year]);

  const isCurrentMonth =
    cursor.year === todayDate.getFullYear() && cursor.month === todayDate.getMonth();
  const isCurrentYear = cursor.year >= todayDate.getFullYear();

  const goMonth = (delta: 1 | -1) => {
    setSlide(delta);
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1, 12);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const goYear = (delta: 1 | -1) => {
    setSlide(delta);
    setCursor((c) => ({ ...c, year: c.year + delta }));
  };

  const leading = (new Date(cursor.year, cursor.month, 1, 12).getDay() + 6) % 7;
  const total = daysInMonth(cursor.year, cursor.month);
  const cells: (string | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: total }, (_, i) => monthKey(cursor.year, cursor.month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);


  return (
    <div>
      {/* Переключатель режима: Месяц / Год */}
      <section className="px-4 pt-4">
        <div className="grid grid-cols-2 gap-2">
          <ModeTab active={mode === "month"} onClick={() => setMode("month")}>
            {t.cal.modeMonth}
          </ModeTab>
          <ModeTab active={mode === "year"} onClick={() => setMode("year")}>
            {t.cal.modeYear}
          </ModeTab>
        </div>
      </section>

      {mode === "month" ? (
        <>
          <section className="flex items-center justify-between gap-2 px-4 py-4">
            <button
              type="button"
              onClick={() => goMonth(-1)}
              aria-label={t.cal.prevMonth}
              className="press flex h-11 w-11 items-center justify-center rounded-[2px] border border-ink/25 text-ink hover:border-ink hover:bg-paper-deep"
            >
              <ChevronIcon dir="left" />
            </button>
            <div className="text-center">
              <Rubric>{f(t.cal.inMonth, { n: stats.total, days: daysWord(stats.total, locale) })}</Rubric>
              <h2 className="font-display text-[1.7rem] leading-tight">
                {formatMonthTitle(cursor.year, cursor.month, locale)}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => goMonth(1)}
              disabled={isCurrentMonth}
              aria-label={t.cal.nextMonth}
              className="press flex h-11 w-11 items-center justify-center rounded-[2px] border border-ink/25 text-ink hover:border-ink hover:bg-paper-deep disabled:cursor-not-allowed disabled:border-ink/12 disabled:text-mute/60 disabled:hover:bg-transparent"
            >
              <ChevronIcon dir="right" />
            </button>
          </section>

          {/* Сетка месяца */}
          <section className="border-y border-ink/15">
            <div className="grid grid-cols-7">
              {weekdayHeaders().map((w) => (
                <div
                  key={w.short}
                  className={
                    "rubric py-2 text-center " + (w.weekend ? "text-clay-deep" : "text-mute")
                  }
                  aria-hidden="true"
                >
                  {w.short}
                </div>
              ))}
            </div>
            <div className="border-t border-ink/15">
              <div
                key={`${cursor.year}-${cursor.month}`}
                className="anim-month grid grid-cols-7"
                style={{ ["--slide-from" as string]: `${slide * 14}px` }}
              >
                {cells.map((key, i) => {
                  if (!key) {
                    return (
                      <div
                        key={`empty-${i}`}
                        className="hatch aspect-square border-b border-r border-ink/10 opacity-50"
                        aria-hidden="true"
                      />
                    );
                  }
                  const status: DayView = map.get(key)?.status ?? "unmarked";
                  const future = isFutureKey(key, today);
                  const isToday = key === today;
                  const dayNumber = keyToDateTime(key).getDate();
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={future}
                      onClick={() => onOpenDay(key)}
                      aria-label={
                        f(t.cal.cellAria, {
                          date: formatDayShort(key, locale),
                          status: t.status[status],
                        }) + (future ? t.cal.futureSuffix : "")
                      }
                      aria-disabled={future}
                      className={
                        "relative aspect-square border-b border-r border-ink/10 transition-colors " +
                        (future
                          ? "cursor-default bg-paper-deep/30"
                          : "hover:bg-paper-deep/70 active:bg-moss-pale") +
                        (isToday ? " ring-inset ring-2 ring-ink" : "")
                      }
                    >
                      <span
                        className={
                          "tnum absolute left-1.5 top-1 text-[0.72rem] leading-none " +
                          (future
                            ? "text-mute/50"
                            : isToday
                              ? "font-semibold text-ink"
                              : "text-ink-soft")
                        }
                      >
                        {dayNumber}
                      </span>
                      <span
                        className={
                          "absolute inset-0 flex items-center justify-center pb-1 " +
                          (status === "alcohol"
                            ? "text-clay"
                            : status === "alcohol_free"
                              ? "text-moss"
                              : future
                                ? "text-paper-edge"
                                : "text-ink/45")
                        }
                      >
                        <StatusGlyph status={status} size={17} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="px-5 py-5">
            <Rubric>{t.legend.title}</Rubric>
            <div className="mt-3">
              <Legend />
            </div>
          </section>

          <section className="border-t border-ink/15 bg-paper-deep/40 px-5 py-5">
            <Rubric>{t.cal.summaryMonth}</Rubric>
            <div className="mt-3 grid grid-cols-3 divide-x divide-ink/15">
              <Count value={stats.alcoholFree} label={t.cal.cFree} tone="moss" />
              <Count value={stats.alcohol} label={t.cal.cAlcohol} tone="clay" />
              <Count value={stats.unmarked} label={t.cal.cUnmarked} tone="mute" />
            </div>
            <p className="mt-4 text-[0.85rem] leading-relaxed text-mute">{t.cal.monthNote}</p>
          </section>
        </>
      ) : (
        <>
          {/* Навигация по годам */}
          <section className="flex items-center justify-between gap-2 px-4 py-4">
            <button
              type="button"
              onClick={() => goYear(-1)}
              aria-label={t.cal.prevYear}
              className="press flex h-11 w-11 items-center justify-center rounded-[2px] border border-ink/25 text-ink hover:border-ink hover:bg-paper-deep"
            >
              <ChevronIcon dir="left" />
            </button>
            <div className="text-center">
              <Rubric>{f(t.cal.inYear, { n: yearStats.total, days: daysWord(yearStats.total, locale) })}</Rubric>
              <h2 className="font-display text-[1.75rem] leading-tight">
                {f(t.cal.yearLabel, { y: cursor.year })}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => goYear(1)}
              disabled={isCurrentYear}
              aria-label={t.cal.nextYear}
              className="press flex h-11 w-11 items-center justify-center rounded-[2px] border border-ink/25 text-ink hover:border-ink hover:bg-paper-deep disabled:cursor-not-allowed disabled:border-ink/12 disabled:text-mute/60 disabled:hover:bg-transparent"
            >
              <ChevronIcon dir="right" />
            </button>
          </section>

          {/* Итог года сверху для быстрого обзора */}
          <section className="border-y border-ink/15 bg-paper-deep/40 px-5 py-4">
            <Rubric>{f(t.cal.summaryYear, { y: cursor.year })}</Rubric>
            <div className="mt-3 grid grid-cols-3 divide-x divide-ink/15">
              <Count value={yearStats.alcoholFree} label={t.cal.cFree} tone="moss" />
              <Count value={yearStats.alcohol} label={t.cal.cAlcohol} tone="clay" />
              <Count value={yearStats.unmarked} label={t.cal.cUnmarked} tone="mute" />
            </div>
          </section>

          {/* Сетка из 12 месяцев года */}
          <section className="px-4 py-4">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {yearMonths.map((m) => (
                <MiniMonthCard
                  key={`${m.year}-${m.monthIndex}`}
                  year={m.year}
                  monthIndex={m.monthIndex}
                  alcoholFree={m.alcoholFree}
                  alcohol={m.alcohol}
                  today={today}
                  map={map}
                  onSelectMonth={() => {
                    setCursor({ year: m.year, month: m.monthIndex });
                    setMode("month");
                  }}
                  onOpenDay={onOpenDay}
                />
              ))}
            </div>
          </section>

          <section className="border-t border-ink/15 px-5 py-5">
            <Rubric>{t.legend.title}</Rubric>
            <div className="mt-3">
              <Legend />
            </div>
            <p className="mt-4 text-[0.83rem] leading-relaxed text-mute">{t.cal.yearHint}</p>
          </section>
        </>
      )}
    </div>
  );
}

function MiniMonthCard({
  year,
  monthIndex,
  alcoholFree,
  alcohol,
  today,
  map,
  onSelectMonth,
  onOpenDay,
}: {
  year: number;
  monthIndex: number;
  alcoholFree: number;
  alcohol: number;
  today: string;
  map: Map<string, DayRecord>;
  onSelectMonth: () => void;
  onOpenDay: (date: string) => void;
}) {
  const leading = (new Date(year, monthIndex, 1, 12).getDay() + 6) % 7;
  const total = daysInMonth(year, monthIndex);
  const cells: (string | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: total }, (_, i) => monthKey(year, monthIndex, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const { t, locale, fmt: f } = useI18n();
  const monthName = formatMonthName(monthIndex, locale);

  return (
    <div className="rounded-[2px] border border-ink/15 bg-paper-deep/25 p-3">
      <div className="flex items-center justify-between gap-2 border-b border-ink/12 pb-2">
        <button
          type="button"
          onClick={onSelectMonth}
          className="font-display text-[1.1rem] font-medium text-ink hover:text-moss-deep"
          aria-label={f(t.cal.openMonth, { month: monthName, y: year })}
        >
          {monthName}
        </button>
        <div className="tnum flex items-center gap-2.5 text-[0.72rem]">
          <span className="inline-flex items-center gap-1 text-moss-deep" title={t.cal.tipFree}>
            <LeafIcon size={12} />
            {alcoholFree}
          </span>
          <span className="inline-flex items-center gap-1 text-clay-deep" title={t.cal.tipAlcohol}>
            <BottleIcon size={12} />
            {alcohol}
          </span>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-[3px]">
        {["пн", "вт", "ср", "чт", "пт", "сб", "вс"].map((d) => (
          <span key={d} className="text-center text-[0.58rem] uppercase text-mute" aria-hidden="true">
            {d}
          </span>
        ))}
        {cells.map((key, idx) => {
          if (!key) {
            return <span key={`blank-${idx}`} className="aspect-square" aria-hidden="true" />;
          }
          const status: DayView = map.get(key)?.status ?? "unmarked";
          const future = isFutureKey(key, today);
          const isToday = key === today;
          const dayNum = keyToDateTime(key).getDate();

          const tone =
            status === "alcohol"
              ? "border-clay/70 bg-clay-pale text-clay-deep font-semibold"
              : status === "alcohol_free"
                ? "border-moss/70 bg-moss-pale text-moss-deep font-semibold"
                : future
                  ? "border-transparent text-mute/35"
                  : "border-ink/10 bg-paper/60 text-ink-soft hover:border-ink/40";

          return (
            <button
              key={key}
              type="button"
              disabled={future}
              onClick={() => onOpenDay(key)}
              aria-label={f(t.cal.cellAria, {
                date: `${formatDayShort(key, locale)} ${year}`,
                status: t.status[status],
              })}
              className={
                "tnum flex aspect-square items-center justify-center rounded-[2px] border text-[0.65rem] leading-none transition-colors " +
                tone +
                (isToday ? " ring-1 ring-ink" : "")
              }
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ModeTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "press min-h-10 rounded-[2px] border px-3 text-[0.88rem] font-medium " +
        (active
          ? "border-ink bg-ink text-paper"
          : "border-ink/25 bg-transparent text-ink-soft hover:border-ink hover:text-ink")
      }
    >
      {children}
    </button>
  );
}

function Count({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: "moss" | "clay" | "mute";
}) {
  const color = tone === "moss" ? "text-moss-deep" : tone === "clay" ? "text-clay-deep" : "text-ink";
  return (
    <div className="px-2 text-center first:pl-0 last:pr-0">
      <div className={"tnum font-display text-[2.1rem] leading-none font-medium " + color}>{value}</div>
      <div className="mt-1.5 text-[0.72rem] leading-tight text-ink-soft">{label}</div>
    </div>
  );
}
