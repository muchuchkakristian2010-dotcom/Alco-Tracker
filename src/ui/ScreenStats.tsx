import { useMemo, useState, type ReactNode } from "react";
import {
  formatDayShort,
  formatMonthName,
  formatMonthShort,
  isFutureKey,
  keyToDateTime,
  yearRange,
} from "../core/dates";
import {
  computePeriodStats,
  computeYearMonthlyStats,
  resolveRange,
  share,
  type PeriodKind,
} from "../core/stats";
import { buildDaySequence } from "../core/streaks";
import { daysWord } from "../core/plural";
import { useI18n } from "../i18n/context";
import type { AppData } from "../app/store";
import { Hairline, Rubric } from "./bits";
import { BottleIcon, ChevronIcon, LeafIcon, RingIcon, StatusGlyph } from "./Icons";
import { cn } from "../utils/cn";

export function ScreenStats({
  data,
  onOpenDay,
}: {
  data: AppData;
  onOpenDay?: (date: string) => void;
}) {
  const { t, locale, fmt: f } = useI18n();
  const { today, records } = data;
  const currentYear = Number(today.slice(0, 4));
  const [kind, setKind] = useState<PeriodKind>("week");
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const range = useMemo(() => {
    if (kind === "year") {
      const { from, to } = yearRange(selectedYear);
      return { from, to, labelKey: "thisYear" as const };
    }
    return resolveRange(kind, today, new Date());
  }, [kind, today, selectedYear, currentYear]);

  const rangeLabel =
    kind === "year" && selectedYear !== currentYear
      ? f(t.stats.yearN, { y: selectedYear })
      : t.stats[range.labelKey];

  const stats = useMemo(
    () => computePeriodStats(records, range.from, range.to),
    [records, range.from, range.to]
  );

  const days = useMemo(
    () => (kind === "year" ? [] : buildDaySequence(records, range.from, range.to)),
    [kind, records, range.from, range.to]
  );

  const monthlyBuckets = useMemo(
    () => (kind === "year" ? computeYearMonthlyStats(records, selectedYear) : []),
    [kind, records, selectedYear]
  );

  const title = `${formatDayShort(range.from, locale)} — ${formatDayShort(range.to, locale)}`;

  const noRecords = records.length === 0;

  return (
    <div>
      <section className="px-5 pt-5">
        <div className="flex items-baseline justify-between gap-3">
          <Rubric>{t.stats.rubric}</Rubric>
          <span className="text-[0.75rem] text-mute">{rangeLabel}</span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Tab active={kind === "week"} onClick={() => setKind("week")}>
            {t.stats.week}
          </Tab>
          <Tab active={kind === "month"} onClick={() => setKind("month")}>
            {t.stats.month}
          </Tab>
          <Tab
            active={kind === "year"}
            onClick={() => {
              setSelectedYear(currentYear);
              setKind("year");
            }}
          >
            {t.stats.year}
          </Tab>
        </div>

        {kind === "year" ? (
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setSelectedYear((y) => y - 1)}
              aria-label={t.cal.prevYear}
              className="press flex h-10 w-10 items-center justify-center rounded-[2px] border border-ink/25 text-ink hover:border-ink hover:bg-paper-deep"
            >
              <ChevronIcon dir="left" />
            </button>
            <div className="text-center">
              <h2 className="font-display text-[1.45rem] leading-tight">{title}</h2>
              <span className="tnum rubric mt-1 block text-mute">
                {f(t.stats.total, { n: `${stats.total} ${daysWord(stats.total, locale)}` })}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedYear((y) => y + 1)}
              disabled={selectedYear >= currentYear}
              aria-label={t.cal.nextYear}
              className="press flex h-10 w-10 items-center justify-center rounded-[2px] border border-ink/25 text-ink hover:border-ink hover:bg-paper-deep disabled:cursor-not-allowed disabled:border-ink/12 disabled:text-mute/50"
            >
              <ChevronIcon dir="right" />
            </button>
          </div>
        ) : (
          <div className="mt-4 flex items-baseline justify-between gap-3">
            <h2 className="font-display text-[1.55rem] leading-tight">{title}</h2>
            <span className="tnum rubric text-mute">{f(t.stats.total, { n: stats.total })}</span>
          </div>
        )}
      </section>

      {/* Три счётчика: цвет + подпись, без «дней без алкоголя» среди неотмеченных */}
      <section className="mt-4 border-y border-ink/15 bg-paper-deep/40">
        <div className="grid grid-cols-3 divide-x divide-ink/15 px-1 py-5">
          <Cell
            value={stats.alcoholFree}
            label={t.cal.cFree}
            icon={<StatusGlyph status="alcohol_free" size={15} />}
            tone="moss"
          />
          <Cell
            value={stats.alcohol}
            label={t.cal.cAlcohol}
            icon={<StatusGlyph status="alcohol" size={15} />}
            tone="clay"
          />
          <Cell
            value={stats.unmarked}
            label={t.cal.cUnmarked}
            icon={<StatusGlyph status="unmarked" size={15} />}
            tone="mute"
          />
        </div>
      </section>

      <section className="px-5 py-5">
        <Rubric>{t.stats.shareTitle}</Rubric>
        <div
          className="mt-3 flex h-5 w-full overflow-hidden rounded-[2px] border border-ink/20"
          role="img"
          aria-label={`Без алкоголя ${stats.alcoholFree}, с алкоголем ${stats.alcohol}, не отмечено ${stats.unmarked} из ${stats.total} дней`}
        >
          {stats.alcoholFree > 0 && (
            <div className="h-full bg-moss" style={{ width: `${share(stats.alcoholFree, stats.total)}%` }} />
          )}
          {stats.alcohol > 0 && (
            <div className="h-full bg-clay" style={{ width: `${share(stats.alcohol, stats.total)}%` }} />
          )}
          {stats.unmarked > 0 && (
            <div className="hatch h-full" style={{ width: `${share(stats.unmarked, stats.total)}%` }} />
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.78rem] text-ink-soft">
          <span>{f(t.stats.shareFree, { p: share(stats.alcoholFree, stats.total) })}</span>
          <span>{f(t.stats.shareAlcohol, { p: share(stats.alcohol, stats.total) })}</span>
          <span>{f(t.stats.shareUnmarked, { p: share(stats.unmarked, stats.total) })}</span>
        </div>
        <p className="mt-3 text-[0.85rem] leading-relaxed text-mute">
          {f(t.stats.markedOf, {
            free: stats.alcoholFree,
            days: daysWord(stats.alcoholFree, locale),
            total: stats.total,
          })}{" "}
          {stats.unmarked > 0
            ? f(t.stats.restUnmarked, { n: stats.unmarked, days: daysWord(stats.unmarked, locale) })
            : t.stats.allMarked}
        </p>
      </section>

      {kind === "year" ? (
        <>
          {/* Помесячная разбивка за весь год */}
          <section className="border-t border-ink/15 px-5 py-5">
            <div className="flex items-baseline justify-between gap-2">
              <Rubric>{f(t.stats.byMonths, { y: selectedYear })}</Rubric>
              <span className="text-[0.72rem] text-mute">{t.stats.monthsCount}</span>
            </div>

            <div className="mt-3.5 space-y-3">
              {monthlyBuckets.map((m) => (
                <div key={m.monthIndex} className="rounded-[2px] border border-ink/12 bg-paper-deep/25 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2 text-[0.84rem]">
                    <span className="font-medium text-ink">{formatMonthName(m.monthIndex)}</span>
                    <div className="tnum flex items-center gap-3 text-[0.76rem]">
                      <span className="inline-flex items-center gap-1 text-moss-deep" title="Без алкоголя">
                        <LeafIcon size={12} />
                        {m.alcoholFree}
                      </span>
                      <span className="inline-flex items-center gap-1 text-clay-deep" title="С алкоголем">
                        <BottleIcon size={12} />
                        {m.alcohol}
                      </span>
                      <span className="inline-flex items-center gap-1 text-mute" title="Не отмечено">
                        <RingIcon size={12} />
                        {m.unmarked}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex h-2.5 w-full overflow-hidden rounded-[1px] border border-ink/15">
                    {m.alcoholFree > 0 && (
                      <div
                        className="h-full bg-moss"
                        style={{ width: `${(m.alcoholFree / m.total) * 100}%` }}
                      />
                    )}
                    {m.alcohol > 0 && (
                      <div
                        className="h-full bg-clay"
                        style={{ width: `${(m.alcohol / m.total) * 100}%` }}
                      />
                    )}
                    {m.unmarked > 0 && (
                      <div
                        className="hatch h-full"
                        style={{ width: `${(m.unmarked / m.total) * 100}%` }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Компактная матрица всех 365/366 дней года */}
          <section className="border-t border-ink/15 px-5 py-5">
            <Rubric>{f(t.stats.yearMap, { y: selectedYear })}</Rubric>
            <div className="mt-3 space-y-1.5">
              {monthlyBuckets.map((m) => {
                const seq = buildDaySequence(records, m.from, m.to);
                return (
                  <div key={m.monthIndex} className="flex items-center gap-2">
                    <span className="w-8 shrink-0 text-[0.68rem] uppercase tracking-wider text-mute">
                      {formatMonthShort(m.monthIndex)}
                    </span>
                    <div className="grid flex-1 grid-cols-31 gap-[2px]" style={{ gridTemplateColumns: "repeat(31, minmax(0, 1fr))" }}>
                      {seq.map((d) => {
                        const status = d.status ?? "unmarked";
                        const future = isFutureKey(d.date, today);
                        return (
                          <button
                            key={d.date}
                            type="button"
                            disabled={future || !onOpenDay}
                            onClick={() => onOpenDay?.(d.date)}
                            title={`${formatDayShort(d.date, locale)} ${selectedYear} — ${t.status[status]}`}
                            aria-label={`${formatDayShort(d.date, locale)} ${selectedYear} — ${t.status[status]}`}
                            className={
                              "h-3 w-full rounded-[1px] border transition-transform " +
                              (status === "alcohol"
                                ? "border-clay bg-clay"
                                : status === "alcohol_free"
                                  ? "border-moss bg-moss"
                                  : future
                                    ? "border-ink/5 bg-paper-deep/20 opacity-40"
                                    : "border-ink/15 bg-paper-deep/60 hover:border-ink/50")
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[0.78rem] text-mute">{t.stats.mapHint}</p>
          </section>
        </>
      ) : (
        <section className="border-t border-ink/15 px-5 py-5">
          <Rubric>{kind === "week" ? t.stats.eachWeek : t.stats.eachMonth}</Rubric>
          <div className={cn("mt-3 grid gap-1.5 grid-cols-7")}>
            {days.map((d) => {
              const status = d.status ?? "unmarked";
              const num = keyToDateTime(d.date).getDate();
              const future = isFutureKey(d.date, today);
              return (
                <button
                  key={d.date}
                  type="button"
                  disabled={future || !onOpenDay}
                  onClick={() => onOpenDay?.(d.date)}
                  title={f(t.stats.cellTitle, { date: formatDayShort(d.date, locale), status: t.status[status] })}
                  className={
                    "flex aspect-square flex-col items-center justify-center gap-1 rounded-[2px] border " +
                    (status === "alcohol"
                      ? "border-clay/55 bg-clay-pale text-clay-deep"
                      : status === "alcohol_free"
                        ? "border-moss/55 bg-moss-pale text-moss-deep"
                        : "border-ink/12 bg-paper text-mute")
                  }
                >
                  <StatusGlyph status={status} size={14} />
                  <span className="tnum text-[0.62rem] leading-none">{num}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[0.78rem] text-mute">
            {kind === "week" ? t.stats.hintWeek : t.stats.hintMonth}
          </p>
        </section>
      )}

      {noRecords && (
        <section className="px-5 pb-6">
          <Hairline />
          <div className="mt-4 border-l-2 border-ink/25 pl-3">
            <div className="font-display text-xl">{t.stats.emptyTitle}</div>
            <p className="mt-1 max-w-[44ch] text-[0.88rem] leading-relaxed text-ink-soft">
              {t.stats.emptyText}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "press min-h-11 rounded-[2px] border px-3 text-[0.9rem] font-medium " +
        (active
          ? "border-ink bg-ink text-paper"
          : "border-ink/25 bg-transparent text-ink-soft hover:border-ink hover:text-ink")
      }
    >
      {children}
    </button>
  );
}

function Cell({
  value,
  label,
  icon,
  tone,
}: {
  value: number;
  label: string;
  icon: ReactNode;
  tone: "moss" | "clay" | "mute";
}) {
  const color = tone === "moss" ? "text-moss-deep" : tone === "clay" ? "text-clay-deep" : "text-ink-soft";
  return (
    <div className="flex flex-col items-center px-1 text-center">
      <span className={color}>{icon}</span>
      <span className={"tnum font-display mt-2 text-[2.4rem] leading-none font-medium " + color}>
        {value}
      </span>
      <span className="mt-2 text-[0.74rem] leading-tight text-ink-soft">{label}</span>
    </div>
  );
}


