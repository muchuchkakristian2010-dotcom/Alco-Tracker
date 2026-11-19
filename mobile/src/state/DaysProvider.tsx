import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createDayRepository, type DayRepository } from "../db/repository";
import { I18nProvider } from "../i18n/context";
import type { Locale } from "../core/types";
import { todayKey } from "../core/dates";
import { getStreakInfo, toRecordMap, type StreakInfo } from "../core/streaks";
import type { DayRecord, DayStatus } from "../core/types";

export interface DaysData {
  ready: boolean;
  today: string;
  records: DayRecord[];
  map: Map<string, DayRecord>;
  info: StreakInfo;
  locale: Locale;
  setLocale(locale: Locale): void;
  setDay(date: string, status: DayStatus, note?: string | null): Promise<void>;
  removeDay(date: string): Promise<void>;
  clearAll(): Promise<void>;
}

const DaysContext = createContext<DaysData | null>(null);

export function DaysProvider({
  children,
  repository,
}: {
  children: ReactNode;
  repository?: DayRepository;
}) {
  const repo = useMemo(() => repository ?? createDayRepository(), [repository]);
  const today = useMemo(() => todayKey(), []);
  const [records, setRecords] = useState<DayRecord[]>([]);
  const [ready, setReady] = useState(false);
  const [locale, setLocaleState] = useState<Locale>("ru");

  const refresh = useCallback(async () => {
    const rows = await repo.getAll();
    setRecords(rows);
  }, [repo]);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      repo.setSetting("locale", next).catch(() => undefined);
    },
    [repo]
  );

  useEffect(() => {
    refresh()
      .catch(() => undefined)
      .finally(() => setReady(true));
    repo
      .getSetting("locale")
      .then((value) => {
        if (value === "ru" || value === "uk" || value === "en") setLocaleState(value);
      })
      .catch(() => undefined);
  }, [refresh, repo]);

  const setDay = useCallback(
    async (date: string, status: DayStatus, note: string | null = null) => {
      await repo.upsert({ date, status, note });
      await refresh();
    },
    [refresh, repo]
  );

  const removeDay = useCallback(
    async (date: string) => {
      await repo.remove(date);
      await refresh();
    },
    [refresh, repo]
  );

  const clearAll = useCallback(async () => {
    await repo.clear();
    await refresh();
  }, [refresh, repo]);

  const map = useMemo(() => toRecordMap(records), [records]);
  const info = useMemo(() => getStreakInfo(records, today), [records, today]);

  const value = useMemo<DaysData>(
    () => ({ ready, today, records, map, info, locale, setLocale, setDay, removeDay, clearAll }),
    [ready, today, records, map, info, locale, setLocale, setDay, removeDay, clearAll]
  );

  return (
    <DaysContext.Provider value={value}>
      <I18nProvider locale={value.locale}>{children}</I18nProvider>
    </DaysContext.Provider>
  );
}

export function useDaysData(): DaysData {
  const value = useContext(DaysContext);
  if (!value) throw new Error("useDaysData должен использоваться внутри DaysProvider");
  return value;
}
