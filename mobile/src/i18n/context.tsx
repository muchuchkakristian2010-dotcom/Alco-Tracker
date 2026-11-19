import React, { createContext, useContext, type ReactNode } from "react";
import { getDict, fmt, type Dict, type Locale } from "./dict";

export interface I18nValue {
  locale: Locale;
  t: Dict;
  fmt: (template: string, params: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value: I18nValue = React.useMemo(
    () => ({ locale, t: getDict(locale), fmt }),
    [locale]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n должен использоваться внутри I18nProvider");
  return value;
}
