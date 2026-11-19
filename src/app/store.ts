import { useCallback, useEffect, useMemo, useState } from "react";
import { LocalStorageDayRepository, type DayRepository } from "../core/repository";
import { todayKey } from "../core/dates";
import { getStreakInfo, toRecordMap, type StreakInfo } from "../core/streaks";
import type { DayRecord, DayStatus, Locale } from "../core/types";

export type ThemeMode = "dark" | "light";

export const DEFAULT_APP_NAME = "Ясно";
export const APP_NAME_PRESETS = ["Ясно", "Тихий счёт", "Берег", "Равновесие"] as const;

const THEME_STORAGE_KEY = "yasno.theme.v1";
const NAME_STORAGE_KEY = "yasno.name.v1";
const LOCALE_STORAGE_KEY = "yasno.locale.v1";

function readInitialLocale(): Locale {
  try {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === "ru" || saved === "uk" || saved === "en") return saved;
  } catch {
    // ignore
  }
  return "ru";
}

function readInitialTheme(): ThemeMode {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // ignore
  }
  return "dark";
}

function readInitialName(): string {
  try {
    const saved = window.localStorage.getItem(NAME_STORAGE_KEY);
    if (saved && saved.trim().length > 0) return saved.trim();
  } catch {
    // ignore
  }
  return DEFAULT_APP_NAME;
}

export interface AppData {
  ready: boolean;
  today: string;
  records: DayRecord[];
  map: Map<string, DayRecord>;
  info: StreakInfo;
  theme: ThemeMode;
  setTheme(mode: ThemeMode): void;
  toggleTheme(): void;
  locale: Locale;
  setLocale(locale: Locale): void;
  appName: string;
  setAppName(name: string): void;
  setDay(date: string, status: DayStatus, note?: string | null): Promise<void>;
  removeDay(date: string): Promise<void>;
  clearAll(): Promise<void>;
}

const defaultRepository: DayRepository = new LocalStorageDayRepository();

export function useDays(repository: DayRepository = defaultRepository): AppData {
  const [records, setRecords] = useState<DayRecord[]>([]);
  const [ready, setReady] = useState(false);
  const [theme, setThemeState] = useState<ThemeMode>(() => readInitialTheme());
  const [locale, setLocaleState] = useState<Locale>(() => readInitialLocale());
  const [appName, setAppNameState] = useState<string>(() => readInitialName());
  const today = useMemo(() => todayKey(), []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#131714" : "#F2EDE3");
    }
  }, [theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // ignore
    }
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);

  useEffect(() => {
    const clean = appName.trim() || DEFAULT_APP_NAME;
    document.title = `${clean} — календарь дней без алкоголя`;
    try {
      window.localStorage.setItem(NAME_STORAGE_KEY, clean);
    } catch {
      // ignore
    }
  }, [appName]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const setAppName = useCallback((name: string) => {
    const trimmed = name.trim().slice(0, 28);
    setAppNameState(trimmed.length > 0 ? trimmed : DEFAULT_APP_NAME);
  }, []);

  useEffect(() => {
    let alive = true;
    repository
      .getAll()
      .then((rows) => {
        if (!alive) return;
        setRecords(rows);
        setReady(true);
      })
      .catch(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, [repository]);

  const refresh = useCallback(async () => {
    const rows = await repository.getAll();
    setRecords(rows);
  }, [repository]);

  const setDay = useCallback(
    async (date: string, status: DayStatus, note: string | null = null) => {
      await repository.upsert({ date, status, note });
      await refresh();
    },
    [refresh, repository]
  );

  const removeDay = useCallback(
    async (date: string) => {
      await repository.remove(date);
      await refresh();
    },
    [refresh, repository]
  );

  const clearAll = useCallback(async () => {
    await repository.clear();
    await refresh();
  }, [refresh, repository]);

  const map = useMemo(() => toRecordMap(records), [records]);
  const info = useMemo(() => getStreakInfo(records, today), [records, today]);

  return {
    ready,
    today,
    records,
    map,
    info,
    theme,
    setTheme,
    toggleTheme,
    locale,
    setLocale,
    appName,
    setAppName,
    setDay,
    removeDay,
    clearAll,
  };
}
