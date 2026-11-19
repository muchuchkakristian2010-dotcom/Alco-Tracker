import { daysWord } from "../core/plural";
import { addDaysKey, formatDayLong, formatDayShort, formatMonthYear, keyToDateTime } from "../core/dates";
import { buildDaySequence } from "../core/streaks";
import type { DayRecord } from "../core/types";
import { useI18n } from "../i18n/context";
import type { AppData } from "../app/store";
import { Hairline, Rubric, StampButton, StatusStamp } from "./bits";
import { BottleIcon, LeafIcon, PencilIcon, RingIcon, TrashIcon } from "./Icons";
import emptyPhoto from "../assets/still.jpg";
import platePhoto from "../assets/plate.jpg";

const THREAD_DAYS = 24;

function Thread({ records, today }: { records: DayRecord[]; today: string }) {
  const { t, locale, fmt: f } = useI18n();
  const days = buildDaySequence(records, addDaysKey(today, -(THREAD_DAYS - 1)), today);
  return (
    <div className="px-5 py-5">
      <Rubric>{f(t.today.thread, { n: THREAD_DAYS })}</Rubric>
      <div className="mt-3 flex items-end gap-[2px]" role="list" aria-label="Последние 24 дня по вашим отметкам">
        {days.map((d) => (
          <div
            key={d.date}
            role="listitem"
            className="flex min-w-0 flex-1 flex-col items-center gap-[6px]"
          >
            <span
              className={
                d.status === "alcohol"
                  ? "text-clay"
                  : d.status === "alcohol_free"
                    ? "text-moss"
                    : "text-ink/40"
              }
            >
              {d.status === "alcohol" ? (
                <BottleIcon size={13} />
              ) : d.status === "alcohol_free" ? (
                <LeafIcon size={13} />
              ) : (
                <RingIcon size={13} />
              )}
            </span>
            <span
              className={
                "h-[3px] w-full rounded-[1px] " +
                (d.status === "alcohol"
                  ? "bg-clay"
                  : d.status === "alcohol_free"
                    ? "bg-moss"
                    : "hatch")
              }
            />
            <span className="sr-only">
              {f(t.stats.cellTitle, {
                date: formatDayShort(d.date, locale),
                status: t.status[d.status ?? "unmarked"],
              })}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[0.72rem] text-mute">
        <span>{formatDayShort(days[0].date, locale)}</span>
        <span>{f(t.today.todayLabel, { date: formatDayShort(today, locale) })}</span>
      </div>
    </div>
  );
}

export function ScreenToday({ data, onOpenDay }: { data: AppData; onOpenDay: (date: string) => void }) {
  const { t, locale, fmt: f } = useI18n();
  const { today, records, map, info, theme, setDay, removeDay } = data;
  const record = map.get(today);
  const view = record?.status ?? "unmarked";
  const isEmpty = records.length === 0;
  const isDark = theme === "dark";

  return (
    <div className="anim-rise">
      {/* Дата — набранная во всю полосу антиква */}
      <section className="px-5 pt-6">
        <Rubric>{f(t.today.onDay, { date: formatDayLong(today, locale) })}</Rubric>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-x-5 gap-y-4">
          <div>
            <div className="font-display text-[clamp(84px,23vw,132px)] font-medium leading-[0.78] tracking-[-0.02em]">
              {keyToDateTime(today).getDate()}
            </div>
            <div className="rubric mt-3 text-ink-soft">{formatMonthYear(today, locale)}</div>
          </div>
          <div className="mb-1">
            <StatusStamp status={view} />
          </div>
        </div>
      </section>

      {/* Отметка дня */}
      <section className="mt-6 px-5">
        <Hairline />
        <div className="mt-4 flex flex-col gap-2.5">
          {!record ? (
            <>
              <StampButton
                variant="primary"
                className="w-full"
                onClick={() => void setDay(today, "alcohol_free")}
              >
                <LeafIcon size={18} />
                {t.today.markFree}
              </StampButton>
              <StampButton variant="clay" className="w-full" onClick={() => void setDay(today, "alcohol")}>
                <BottleIcon size={18} />
                {t.today.markAlcohol}
              </StampButton>
              <p className="mt-1 text-[0.9rem] leading-relaxed text-ink-soft">
                {t.today.unmarkedNote}
              </p>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <StampButton variant="outline" className="flex-1" onClick={() => onOpenDay(today)}>
                  <PencilIcon size={16} />
                  {t.today.edit}
                </StampButton>
                <StampButton variant="ghost" className="flex-1" onClick={() => void removeDay(today)}>
                  <TrashIcon size={16} />
                  {t.today.delete}
                </StampButton>
              </div>
              {record.note ? (
                <div className="border-l-2 border-ink/25 pl-3">
                  <Rubric>{t.today.note}</Rubric>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-ink">{record.note}</p>
                </div>
              ) : (
                <StampButton variant="ghost" className="justify-start px-0" onClick={() => onOpenDay(today)}>
                  <PencilIcon size={16} />
                  {t.today.addNote}
                </StampButton>
              )}
            </>
          )}
        </div>
      </section>

      {isEmpty && (
        <section className="mt-6 px-5">
          <figure className="overflow-hidden rounded-[2px] border border-ink/15">
            <div className="relative">
              <img
                src={emptyPhoto}
                alt="Стакан воды на льняной салфетке утренним светом"
                className="h-52 w-full object-cover"
                style={{
                  filter: isDark ? "saturate(0.75) brightness(0.55) contrast(1.05)" : "saturate(0.9)",
                  objectPosition: "50% 65%",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: isDark
                    ? "linear-gradient(180deg, rgba(19,23,20,.88) 0%, rgba(19,23,20,.38) 65%, rgba(19,23,20,.7) 100%)"
                    : "linear-gradient(180deg, rgba(242,237,227,.72) 0%, rgba(242,237,227,.1) 55%)",
                }}
              />
              <figcaption className="absolute inset-x-0 top-0 p-4">
                <div className="font-display text-2xl leading-tight">{t.today.emptyTitle}</div>
                <p className="mt-1 max-w-[34ch] text-[0.88rem] leading-snug text-ink-soft">
                  {t.today.emptyText}
                </p>
              </figcaption>
            </div>
          </figure>
        </section>
      )}

      {/* Текущая серия */}
      <section className="mt-7 border-y border-ink/15 bg-paper-deep/45 px-5 py-6">
        <Rubric>{t.today.currentStreak}</Rubric>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="tnum font-display text-[clamp(64px,19vw,104px)] font-medium leading-[0.82] text-moss-deep">
            {info.current}
          </span>
          <span className="text-[1.02rem] leading-tight text-ink">
            {daysWord(info.current, locale)} {t.today.streakAfter}
            <br />
            {t.today.streakOf}
          </span>
        </div>
        <p className="mt-3 max-w-[46ch] text-[0.88rem] leading-relaxed text-ink-soft">
          {!record
            ? t.today.noteUnmarked
            : record.status === "alcohol"
              ? t.today.noteAlcohol
              : t.today.noteFree}
        </p>
      </section>

      {/* Лента */}
      <section className="border-b border-ink/15">
        <Thread records={records} today={today} />
      </section>

      {/* Лучшая серия */}
      <section className="px-5 py-6">
        <div className="flex items-end justify-between gap-4">
          <Rubric className="max-w-[22ch]">{t.today.longest}</Rubric>
          <div className="text-right">
            <span className="tnum font-display text-4xl font-medium leading-none">{info.longest}</span>
            <span className="ml-2 text-[0.9rem] text-ink-soft">{daysWord(info.longest, locale)}</span>
          </div>
        </div>
        <Hairline className="my-4" />
        <p className="text-[0.85rem] leading-relaxed text-mute">{t.today.seriesNote}</p>
      </section>

      {/* Закрывающая пластина — лист, карандаш, стекло */}
      <figure className="border-t border-ink/15">
        <div className="relative">
          <img
            src={platePhoto}
            alt="Прессованный лист, карандаш и стеклянный пресс на тёплой бумаге"
            className="h-40 w-full object-cover"
            style={{
              objectPosition: "50% 55%",
              filter: isDark ? "saturate(0.75) brightness(0.5) contrast(1.05)" : "saturate(0.88)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? "linear-gradient(90deg, rgba(19,23,20,.92) 0%, rgba(19,23,20,.5) 62%, rgba(19,23,20,.18) 100%)"
                : "linear-gradient(90deg, rgba(242,237,227,.86) 0%, rgba(242,237,227,.25) 62%, rgba(242,237,227,0) 100%)",
            }}
          />
          <figcaption className="absolute inset-y-0 left-0 flex max-w-[66%] flex-col justify-center px-5">
            <span className="rubric text-ink-soft">{t.today.plateCaption}</span>
            <p className="mt-2 text-[0.92rem] leading-snug text-ink">{t.today.plateText}</p>
          </figcaption>
        </div>
      </figure>
    </div>
  );
}
