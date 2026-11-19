import * as SQLite from "expo-sqlite";
import type { DayRecord, DayStatus } from "../core/types";

/**
 * Хранилище на устройстве: таблица `days` в локальной SQLite-базе.
 * `date` — локальный ключ дня YYYY-MM-DD, первичный ключ: дубликаты невозможны.
 * Отсутствующая строка означает «не отмечено» — записи для дней не создаются автоматически.
 */
export interface DayRepository {
  getAll(): Promise<DayRecord[]>;
  upsert(input: { date: string; status: DayStatus; note?: string | null }): Promise<void>;
  remove(date: string): Promise<void>;
  clear(): Promise<void>;
  /** Настройки приложения (язык и т. п.), хранятся локально в той же базе. */
  getSetting(key: string): Promise<string | null>;
  setSetting(key: string, value: string): Promise<void>;
}

interface Row {
  date: string;
  status: DayStatus;
  note: string | null;
  updated_at: number;
}

const SCHEMA = `
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS days (
  date TEXT PRIMARY KEY NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('alcohol', 'alcohol_free')),
  note TEXT,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_days_date ON days (date);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
`;

class SqliteDayRepository implements DayRepository {
  private dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

  private async db(): Promise<SQLite.SQLiteDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = SQLite.openDatabaseAsync("nit.db").then(async (db) => {
        await db.execAsync(SCHEMA);
        return db;
      });
    }
    return this.dbPromise;
  }

  async getAll(): Promise<DayRecord[]> {
    const db = await this.db();
    const rows = await db.getAllAsync<Row>(
      "SELECT date, status, note, updated_at FROM days ORDER BY date ASC"
    );
    return rows.map((r) => ({
      date: r.date,
      status: r.status,
      note: r.note ?? null,
      updated_at: r.updated_at,
    }));
  }

  async upsert({ date, status, note = null }: { date: string; status: DayStatus; note?: string | null }): Promise<void> {
    const db = await this.db();
    await db.runAsync(
      `INSERT INTO days (date, status, note, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(date) DO UPDATE SET
         status = excluded.status,
         note = excluded.note,
         updated_at = excluded.updated_at`,
      [date, status, note ?? null, Date.now()]
    );
  }

  async remove(date: string): Promise<void> {
    const db = await this.db();
    await db.runAsync("DELETE FROM days WHERE date = ?", [date]);
  }

  async clear(): Promise<void> {
    const db = await this.db();
    await db.runAsync("DELETE FROM days");
  }

  async getSetting(key: string): Promise<string | null> {
    const db = await this.db();
    const row = await db.getFirstAsync<{ value: string }>(
      "SELECT value FROM settings WHERE key = ?",
      [key]
    );
    return row?.value ?? null;
  }

  async setSetting(key: string, value: string): Promise<void> {
    const db = await this.db();
    await db.runAsync(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      [key, value]
    );
  }
}

export function createDayRepository(): DayRepository {
  return new SqliteDayRepository();
}
