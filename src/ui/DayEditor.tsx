import { useEffect, useState, type ReactNode } from "react";
import { formatDayLong, isFutureKey } from "../core/dates";
import { fmt } from "../i18n/dict";
import type { DayRecord, DayStatus } from "../core/types";
import { useI18n } from "../i18n/context";
import { Hairline, Rubric, StampButton } from "./bits";
import { BottleIcon, LeafIcon, RingIcon, TrashIcon } from "./Icons";

/**
 * Модальное окно редактирования отметки для конкретной даты.
 * Позволяет выбрать статус, добавить заметку, изменить или удалить запись.
 * Будущие даты отмечать нельзя.
 */
export function DayEditor({
  date,
  today,
  record,
  onClose,
  onSave,
  onDelete,
}: {
  date: string;
  today: string;
  record?: DayRecord;
  onClose: () => void;
  onSave: (status: DayStatus, note: string | null) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const { t, locale } = useI18n();
  const future = isFutureKey(date, today);
  const [status, setStatus] = useState<DayStatus | null>(record?.status ?? null);
  const [note, setNote] = useState(record?.note ?? "");
  const [busy, setBusy] = useState(false);

  // Закрытие по Escape и блокировка прокрутки фона, пока окно открыто
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);


  const save = async () => {
    if (!status || future) return;
    setBusy(true);
    try {
      await onSave(status, note.trim() === "" ? null : note.trim());
      onClose();
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await onDelete();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label={t.editor.close}
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
        tabIndex={-1}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={fmt(t.editor.dialogAria, { date: formatDayLong(date, locale) })}
        className="anim-sheet relative w-full max-w-[560px] border-t-2 border-ink bg-paper pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-16px_40px_rgba(0,0,0,.45)] sm:border-2 sm:pb-5"
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5">
          <div>
            <Rubric>{t.editor.markOfDay}</Rubric>
            <h2 className="mt-1.5 font-display text-2xl leading-tight first-letter:uppercase">
              {formatDayLong(date, locale)}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="press -mr-1 -mt-1 flex h-10 w-10 items-center justify-center rounded-[2px] text-xl leading-none text-ink-soft hover:bg-paper-deep hover:text-ink"
            aria-label={t.editor.closeWindow}
          >
            ×
          </button>
        </div>

        <div className="mt-5 px-5">
          <Hairline />
        </div>

        {future ? (
          <div className="px-5 py-6">
            <p className="max-w-[44ch] text-[0.95rem] leading-relaxed text-ink-soft">
              {t.editor.futureText}
            </p>
            <StampButton variant="outline" className="mt-4 w-full" onClick={onClose}>
              {t.editor.understood}
            </StampButton>
          </div>
        ) : (
          <div className="px-5 py-5">
            <Rubric>{t.editor.statusTitle}</Rubric>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <OptionCard
                active={status === "alcohol_free"}
                onClick={() => setStatus("alcohol_free")}
                icon={<LeafIcon size={22} />}
                title={t.statusLong.alcohol_free}
                hint={t.statusHint.alcohol_free}
                tone="moss"
              />
              <OptionCard
                active={status === "alcohol"}
                onClick={() => setStatus("alcohol")}
                icon={<BottleIcon size={22} />}
                title={t.statusLong.alcohol}
                hint={t.statusHint.alcohol}
                tone="clay"
              />
            </div>

            <label className="mt-5 block">
              <Rubric>{t.editor.noteLabel}</Rubric>
              <textarea
                value={note}
                maxLength={400}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t.editor.notePlaceholder}
                className="mt-2 w-full resize-none rounded-[2px] border border-ink/25 bg-paper px-3 py-2.5 text-[0.95rem] leading-relaxed text-ink placeholder:text-mute focus:border-ink focus:outline-none"
                rows={3}
              />
            </label>

            <div className="mt-5 flex flex-col gap-2.5">
              <StampButton
                variant="primary"
                className="w-full"
                disabled={!status || busy}
                onClick={() => void save()}
              >
                {status === record?.status && record ? t.editor.saveEdit : t.editor.saveNew}
              </StampButton>
              <div className="flex gap-2.5">
                <StampButton variant="ghost" className="flex-1" onClick={onClose} disabled={busy}>
                  {t.settings.cancel}
                </StampButton>
                {record && (
                  <StampButton
                    variant="clay"
                    className="flex-1"
                    disabled={busy}
                    onClick={() => void remove()}
                  >
                    <TrashIcon size={16} />
                    {t.today.delete}
                  </StampButton>
                )}
              </div>
            </div>

            {record && (
              <p className="mt-4 text-[0.8rem] leading-relaxed text-mute">
                {t.editor.changedNote}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function OptionCard({
  active,
  onClick,
  icon,
  title,
  hint,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  hint: string;
  tone: "moss" | "clay";
}) {
  const activeTone =
    tone === "moss"
      ? "border-moss bg-moss-pale text-moss-deep"
      : "border-clay bg-clay-pale text-clay-deep";
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        "press flex min-h-[76px] items-start gap-3 rounded-[2px] border-2 px-3.5 py-3 text-left " +
        (active ? activeTone : "border-ink/20 bg-paper text-ink-soft hover:border-ink/45")
      }
    >
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span>
        <span className="block text-[0.98rem] font-semibold text-ink">{title}</span>
        <span className="mt-0.5 block text-[0.78rem] leading-snug">{hint}</span>
      </span>
      <span
        aria-hidden="true"
        className={
          "ml-auto mt-0.5 block h-4 w-4 shrink-0 rounded-full border-2 " +
          (active ? "border-current bg-current" : "border-ink/30")
        }
      />
    </button>
  );
}

/** Легенда статусов — подписи, а не только цвет. */
export function Legend() {
  const { t } = useI18n();
  const rows: { icon: ReactNode; label: string; hint: string }[] = [
    { icon: <BottleIcon size={17} />, label: t.status.alcohol, hint: t.legend.alcohol },
    { icon: <LeafIcon size={17} />, label: t.status.alcohol_free, hint: t.legend.alcohol_free },
    { icon: <RingIcon size={17} />, label: t.status.unmarked, hint: t.legend.unmarked },
  ];
  return (
    <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      {rows.map((r) => (
        <li key={r.label} className="flex items-start gap-2.5">
          <span className="mt-0.5 text-ink-soft">{r.icon}</span>
          <span>
            <span className="block text-[0.88rem] font-semibold text-ink">{r.label}</span>
            <span className="block text-[0.76rem] leading-snug text-mute">{r.hint}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}


