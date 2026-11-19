import type { DayRecord, DayStatus } from "./types";

/**
 * Абстракция хранилища отметок. На устройстве реализуется через expo-sqlite
 * (см. mobile/src/db), в веб-версии — через localStorage. Интерфейс одинаковый.
 */
export interface DayRepository {
  getAll(): Promise<DayRecord[]>;
  /** Вставка или обновление записи по уникальному ключу даты. */
  upsert(input: { date: string; status: DayStatus; note?: string | null }): Promise<void>;
  remove(date: string): Promise<void>;
  clear(): Promise<void>;
}

const STORAGE_KEY = "nit.days.v1";

/** Локальное хранилище браузера (веб-версия приложения). */
export class LocalStorageDayRepository implements DayRepository {
  constructor(private readonly storage: Storage = window.localStorage) {}

  private read(): DayRecord[] {
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (r): r is DayRecord =>
          !!r &&
          typeof r === "object" &&
          typeof (r as DayRecord).date === "string" &&
          ((r as DayRecord).status === "alcohol" || (r as DayRecord).status === "alcohol_free")
      );
    } catch {
      return [];
    }
  }

  private write(records: DayRecord[]): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  async getAll(): Promise<DayRecord[]> {
    return this.read().sort((a, b) => a.date.localeCompare(b.date));
  }

  async upsert({ date, status, note = null }: { date: string; status: DayStatus; note?: string | null }): Promise<void> {
    const records = this.read().filter((r) => r.date !== date);
    records.push({ date, status, note: note ?? null, updated_at: Date.now() });
    this.write(records);
  }

  async remove(date: string): Promise<void> {
    this.write(this.read().filter((r) => r.date !== date));
  }

  async clear(): Promise<void> {
    this.storage.removeItem(STORAGE_KEY);
  }
}
