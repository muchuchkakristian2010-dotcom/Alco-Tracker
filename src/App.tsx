import { useEffect, useState, type ReactElement } from "react";
import { useDays, type AppData } from "./app/store";
import { I18nProvider, useI18n } from "./i18n/context";
import { DayEditor } from "./ui/DayEditor";
import { ScreenCalendar } from "./ui/ScreenCalendar";
import { ScreenSettings } from "./ui/ScreenSettings";
import { ScreenStats } from "./ui/ScreenStats";
import { ScreenToday } from "./ui/ScreenToday";
import {
  CalendarTabIcon,
  MoonIcon,
  SettingsTabIcon,
  StatsTabIcon,
  SunIcon,
  TodayTabIcon,
} from "./ui/Icons";
import { cn } from "./utils/cn";

type TabId = "today" | "calendar" | "stats" | "settings";

const TABS: { id: TabId; Icon: (p: { size?: number; className?: string }) => ReactElement }[] = [
  { id: "today", Icon: TodayTabIcon },
  { id: "calendar", Icon: CalendarTabIcon },
  { id: "stats", Icon: StatsTabIcon },
  { id: "settings", Icon: SettingsTabIcon },
];

export default function App() {
  const data: AppData = useDays();

  return (
    <I18nProvider locale={data.locale}>
      <Shell data={data} />
    </I18nProvider>
  );
}

function Shell({ data }: { data: AppData }) {
  const { t } = useI18n();
  const [tab, setTab] = useState<TabId>("today");
  const [editing, setEditing] = useState<string | null>(null);

  // При смене вкладки прокручиваем к началу полосы
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [tab]);

  const isDark = data.theme === "dark";

  return (
    <div className="relative z-10 min-h-screen">
      <div className="relative mx-auto min-h-screen w-full max-w-[560px] border-x border-ink/12 bg-paper/75">
        <header className="sticky top-0 z-30 border-b border-ink/20 bg-paper/92 backdrop-blur-[4px]">
          <div className="flex h-14 items-center justify-between gap-3 px-5">
            <div className="flex min-w-0 items-baseline gap-2.5">
              <ClearMark />
              <span className="truncate font-display text-[1.35rem] font-semibold tracking-tight leading-none">
                {data.appName}
              </span>
              <span className="rubric hidden text-mute sm:inline">{t.tagline}</span>
            </div>
            <div className="flex shrink-0 items-center gap-2.5">
              <span className="rubric text-ink-soft">{t.tab[tab]}</span>
              <button
                type="button"
                onClick={data.toggleTheme}
                aria-label={isDark ? t.theme.toLight : t.theme.toDark}
                title={isDark ? t.theme.nowDark : t.theme.nowLight}
                className="press inline-flex h-8 items-center gap-1.5 rounded-[2px] border border-ink/25 bg-paper-deep/60 px-2.5 text-[0.72rem] font-medium text-ink-soft hover:border-ink hover:text-ink"
              >
                {isDark ? <MoonIcon size={14} /> : <SunIcon size={14} />}
                <span className="hidden sm:inline">{isDark ? t.theme.dark : t.theme.light}</span>
              </button>
            </div>
          </div>
        </header>

        <main className="pb-28">
          {tab === "today" && <ScreenToday data={data} onOpenDay={setEditing} />}
          {tab === "calendar" && <ScreenCalendar data={data} onOpenDay={setEditing} />}
          {tab === "stats" && <ScreenStats data={data} onOpenDay={setEditing} />}
          {tab === "settings" && <ScreenSettings data={data} />}
        </main>
      </div>

      <nav
        aria-label={t.tagline}
        className="fixed bottom-0 left-1/2 z-40 w-full max-w-[560px] -translate-x-1/2 border-t border-ink/25 bg-paper/96 backdrop-blur-[4px]"
      >
        <ul className="grid grid-cols-4">
          {TABS.map(({ id, Icon }) => {
            const isActive = id === tab;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setTab(id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex w-full flex-col items-center gap-1 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]",
                    "transition-colors",
                    isActive ? "text-ink" : "text-mute hover:text-ink-soft"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-3 top-0 h-[3px] transition-transform",
                      isActive ? "scale-x-100 bg-moss" : "scale-x-0 bg-moss"
                    )}
                  />
                  <Icon size={21} />
                  <span
                    className={cn(
                      "whitespace-nowrap text-[0.6rem] font-semibold uppercase tracking-[0.06em]",
                      isActive && "text-ink"
                    )}
                  >
                    {t.tab[id]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {editing && (
        <DayEditor
          date={editing}
          today={data.today}
          record={data.map.get(editing)}
          onClose={() => setEditing(null)}
          onSave={async (status, note) => {
            await data.setDay(editing, status, note);
          }}
          onDelete={async () => {
            await data.removeDay(editing);
          }}
        />
      )}
    </div>
  );
}

/** Знак «Ясно»: спокойный диск над линией горизонта. */
function ClearMark() {
  return (
    <svg viewBox="0 0 24 18" width="24" height="18" aria-hidden="true" className="text-moss shrink-0">
      <path
        d="M5.5 12.5a6.5 6.5 0 0 1 13 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="8.5" r="2.2" fill="currentColor" />
      <path
        d="M2 15.2h20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
