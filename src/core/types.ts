/** Язык интерфейса. */
export type Locale = "ru" | "uk" | "en";

/** Статусы отметки дня. Отсутствие записи — «не отмечено», отдельного статуса в БД нет. */
export type DayStatus = "alcohol" | "alcohol_free";

/** Статус, отображаемый в интерфейсе: к двум отметкам добавляется «не отмечено». */
export type DayView = DayStatus | "unmarked";

/** Запись в хранилище. `date` — локальный ключ дня YYYY-MM-DD, уникальный. */
export interface DayRecord {
  date: string;
  status: DayStatus;
  note: string | null;
  /** время последнего изменения, мс */
  updated_at: number;
}

export const STATUS_LABELS: Record<DayStatus, string> = {
  alcohol: "Был алкоголь",
  alcohol_free: "Без алкоголя",
};

export const VIEW_LABELS: Record<DayView, string> = {
  alcohol: "Алкоголь",
  alcohol_free: "Без алкоголя",
  unmarked: "Не отмечено",
};

/** Определение статуса по карте записей. */
export function statusOn(map: ReadonlyMap<string, DayRecord>, date: string): DayView {
  return map.get(date)?.status ?? "unmarked";
}
