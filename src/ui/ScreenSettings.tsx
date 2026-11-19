import { useState } from "react";
import { daysWord } from "../core/plural";
import { APP_NAME_PRESETS, type AppData } from "../app/store";
import { LOCALES } from "../i18n/dict";
import { useI18n } from "../i18n/context";
import { Hairline, Rubric, StampButton } from "./bits";
import { MoonIcon, SunIcon, TrashIcon } from "./Icons";

export function ScreenSettings({ data }: { data: AppData }) {
  const { t, locale, fmt: f } = useI18n();
  const { records, clearAll, theme, setTheme, appName, setAppName, setLocale } = data;
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [draftName, setDraftName] = useState(appName);

  const confirm = async () => {
    setBusy(true);
    try {
      await clearAll();
      setConfirming(false);
      setDone(true);
    } finally {
      setBusy(false);
    }
  };

  const applyName = (value: string) => {
    setDraftName(value);
    setAppName(value);
  };

  const localeLabels = {
    ru: t.settings.langRu,
    uk: t.settings.langUk,
    en: t.settings.langEn,
  } as const;

  return (
    <div className="pb-4">
      {/* Язык интерфейса */}
      <section className="px-5 pt-6">
        <Rubric>{t.settings.language}</Rubric>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {LOCALES.map((code) => {
            const active = locale === code;
            return (
              <button
                key={code}
                type="button"
                lang={code}
                aria-pressed={active}
                onClick={() => setLocale(code)}
                className={
                  "press min-h-11 rounded-[2px] border px-2 text-[0.9rem] font-medium " +
                  (active
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/25 bg-transparent text-ink-soft hover:border-ink hover:text-ink")
                }
              >
                {localeLabels[code]}
              </button>
            );
          })}
        </div>
      </section>

      {/* Тема оформления и название */}
      <section className="px-5 pt-6">
        <Rubric>{t.settings.appearance}</Rubric>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            aria-pressed={theme === "dark"}
            onClick={() => setTheme("dark")}
            className={
              "press flex min-h-11 items-center justify-center gap-2 rounded-[2px] border px-3 text-[0.9rem] font-medium " +
              (theme === "dark"
                ? "border-ink bg-ink text-paper"
                : "border-ink/25 bg-transparent text-ink-soft hover:border-ink hover:text-ink")
            }
          >
            <MoonIcon size={16} />
            {t.theme.dark}
          </button>
          <button
            type="button"
            aria-pressed={theme === "light"}
            onClick={() => setTheme("light")}
            className={
              "press flex min-h-11 items-center justify-center gap-2 rounded-[2px] border px-3 text-[0.9rem] font-medium " +
              (theme === "light"
                ? "border-ink bg-ink text-paper"
                : "border-ink/25 bg-transparent text-ink-soft hover:border-ink hover:text-ink")
            }
          >
            <SunIcon size={16} />
            {t.theme.light}
          </button>
        </div>

        <div className="mt-5">
          <label className="block">
            <span className="text-[0.82rem] text-ink-soft">{t.settings.nameLabel}</span>
            <input
              type="text"
              value={draftName}
              maxLength={28}
              onChange={(e) => applyName(e.target.value)}
              aria-label={t.settings.nameLabel}
              placeholder={t.settings.namePlaceholder}
              className="mt-1.5 w-full rounded-[2px] border border-ink/25 bg-paper px-3 py-2 text-[0.95rem] text-ink placeholder:text-mute focus:border-ink focus:outline-none"
            />
          </label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {APP_NAME_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyName(preset)}
                className={
                  "press rounded-[2px] border px-2.5 py-1 text-[0.76rem] " +
                  (appName === preset
                    ? "border-moss bg-moss-pale text-moss-deep font-medium"
                    : "border-ink/20 text-ink-soft hover:border-ink/50 hover:text-ink")
                }
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 px-5">
        <Hairline />
        <div className="mt-5">
          <Rubric>{t.settings.storage}</Rubric>
          <p className="mt-3 max-w-[48ch] text-[0.98rem] leading-relaxed">{t.settings.storageText}</p>
        </div>
      </section>

      <section className="mt-6 px-5">
        <Hairline />
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="tnum font-display text-[2rem] leading-none font-medium">{records.length}</div>
            <div className="mt-1.5 text-[0.76rem] leading-tight text-ink-soft">
              {f(t.settings.records, { days: daysWord(records.length, locale) })}
            </div>
          </div>
          <div>
            <div className="font-display text-[2rem] leading-none font-medium">0</div>
            <div className="mt-1.5 text-[0.76rem] leading-tight text-ink-soft">
              {t.settings.zeroServers}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-7 px-5">
        <Hairline />
        <div className="mt-4">
          <Rubric>{t.settings.about}</Rubric>
          <p className="mt-3 max-w-[48ch] text-[0.9rem] leading-relaxed text-ink-soft">
            {f(t.settings.aboutText, { name: appName })}
          </p>
        </div>
      </section>

      <section className="mt-7 border-t border-ink/15 px-5 pt-5">
        <Rubric className="text-clay-deep">{t.settings.manage}</Rubric>

        {!confirming ? (
          <div className="mt-3">
            <StampButton
              variant="outline"
              className="w-full"
              disabled={records.length === 0}
              onClick={() => {
                setDone(false);
                setConfirming(true);
              }}
            >
              <TrashIcon size={16} />
              {t.settings.clearAll}
            </StampButton>
            <p className="mt-2.5 text-[0.8rem] leading-relaxed text-mute">
              {records.length === 0 ? t.settings.clearHintEmpty : t.settings.clearHint}
            </p>
          </div>
        ) : (
          <div className="anim-rise mt-3 border-2 border-clay bg-clay-pale/70 p-4">
            <div className="font-display text-xl leading-tight">{t.settings.confirmTitle}</div>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-soft">
              {f(t.settings.confirmText, {
                n: records.length,
                days: daysWord(records.length, locale),
              })}
            </p>
            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <StampButton
                variant="danger"
                className="flex-1"
                disabled={busy}
                onClick={() => void confirm()}
              >
                {t.settings.yesDelete}
              </StampButton>
              <StampButton
                variant="ghost"
                className="flex-1"
                disabled={busy}
                onClick={() => setConfirming(false)}
              >
                {t.settings.cancel}
              </StampButton>
            </div>
          </div>
        )}

        {done && !confirming && (
          <p className="anim-rise mt-3 text-[0.88rem] text-moss-deep">{t.settings.deleted}</p>
        )}
      </section>

      <section className="mt-7 px-5 pb-2">
        <p className="text-[0.76rem] leading-relaxed text-mute">
          {f(t.settings.footer, { name: appName })}
        </p>
      </section>
    </div>
  );
}
