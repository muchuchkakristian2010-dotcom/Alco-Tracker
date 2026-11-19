import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDaysData } from "../../src/state/DaysProvider";
import {
  daysInMonth,
  formatDayShort,
  formatMonthName,
  formatMonthTitle,
  isFutureKey,
  keyToDateTime,
  monthKey,
  weekdayHeaders,
} from "../../src/core/dates";
import { computePeriodStats, computeYearMonthlyStats, computeYearStats } from "../../src/core/stats";
import { daysWord } from "../../src/core/plural";
import { useI18n } from "../../src/i18n/context";
import type { DayView } from "../../src/core/types";
import { colors, fonts, radius } from "../../src/theme";
import { Hairline, LegendRow, Rubric, textStyle } from "../../src/components/ui";
import { ChevronIcon, StatusGlyph } from "../../src/components/Icons";

type CalendarMode = "month" | "year";

export default function CalendarScreen() {
  const { t, locale, fmt: f } = useI18n();
  const { today, map, records } = useDaysData();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const todayDate = keyToDateTime(today);
  const [mode, setMode] = useState<CalendarMode>("month");
  const [cursor, setCursor] = useState(() => ({
    year: todayDate.getFullYear(),
    month: todayDate.getMonth(),
  }));

  const monthStart = monthKey(cursor.year, cursor.month, 1);
  const monthEnd = monthKey(cursor.year, cursor.month, daysInMonth(cursor.year, cursor.month));
  const stats = useMemo(
    () => computePeriodStats(records, monthStart, monthEnd),
    [records, monthStart, monthEnd]
  );

  const yearStats = useMemo(() => computeYearStats(records, cursor.year), [records, cursor.year]);
  const yearMonths = useMemo(
    () => computeYearMonthlyStats(records, cursor.year),
    [records, cursor.year]
  );

  const isCurrentMonth =
    cursor.year === todayDate.getFullYear() && cursor.month === todayDate.getMonth();
  const isCurrentYear = cursor.year >= todayDate.getFullYear();

  const goMonth = (delta: number) =>
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1, 12);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const goYear = (delta: number) =>
    setCursor((c) => ({ ...c, year: c.year + delta }));

  const leading = (new Date(cursor.year, cursor.month, 1, 12).getDay() + 6) % 7;
  const total = daysInMonth(cursor.year, cursor.month);
  const cells: (string | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: total }, (_, i) => monthKey(cursor.year, cursor.month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <ScrollView
      style={{ backgroundColor: colors.paper }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
      contentInsetAdjustmentBehavior="never"
    >
      <View style={styles.modeRow}>
        {(["month", "year"] as CalendarMode[]).map((m) => {
          const active = mode === m;
          return (
            <Pressable
              key={m}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setMode(m)}
              style={[styles.modeTab, active ? styles.modeTabActive : styles.modeTabIdle]}
            >
              <Text style={[styles.modeTabText, { color: active ? colors.paper : colors.inkSoft }]}>
                {m === "month" ? t.cal.modeMonth : t.cal.modeYear}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {mode === "month" ? (
        <>
          <View style={styles.navRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t.cal.prevMonth}
              onPress={() => goMonth(-1)}
              style={({ pressed }) => [styles.navButton, pressed && { backgroundColor: colors.paperDeep }]}
            >
              <ChevronIcon dir="left" />
            </Pressable>
            <View style={{ alignItems: "center" }}>
              <Rubric>
                {f(t.cal.inMonth, { n: stats.total, days: daysWord(stats.total, locale) })}
              </Rubric>
              <Text style={styles.monthTitle}>
                {formatMonthTitle(cursor.year, cursor.month, locale)}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t.cal.nextMonth}
              disabled={isCurrentMonth}
              onPress={() => goMonth(1)}
              style={({ pressed }) => [
                styles.navButton,
                pressed && !isCurrentMonth && { backgroundColor: colors.paperDeep },
                isCurrentMonth && { opacity: 0.35 },
              ]}
            >
              <ChevronIcon dir="right" />
            </Pressable>
          </View>

          <View style={styles.gridBorder}>
            <View style={styles.row}>
              {weekdayHeaders().map((w) => (
                <Text key={w.short} style={[styles.weekday, w.weekend && { color: colors.clay }]}>
                  {w.short}
                </Text>
              ))}
            </View>
            <View style={styles.row}>
              {cells.map((key, i) => {
                if (!key) return <View key={`e-${i}`} style={[styles.cell, styles.blank]} />;
                const status: DayView = map.get(key)?.status ?? "unmarked";
                const future = isFutureKey(key, today);
                const isToday = key === today;
                const color =
                  status === "alcohol"
                    ? colors.clay
                    : status === "alcohol_free"
                      ? colors.moss
                      : future
                        ? colors.paperEdge
                        : "rgba(236,231,220,0.35)";
                const label =
                  f(t.cal.cellAria, {
                    date: formatDayShort(key, locale),
                    status: t.status[status],
                  }) + (future ? t.cal.futureSuffix : "");
                return (
                  <Pressable
                    key={key}
                    accessibilityRole="button"
                    accessibilityLabel={label}
                    disabled={future}
                    onPress={() => router.push(`/edit/${key}`)}
                    style={({ pressed }) => [
                      styles.cell,
                      isToday && styles.todayCell,
                      future && { backgroundColor: "rgba(27,33,28,0.45)" },
                      pressed && !future && { backgroundColor: colors.mossPale },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNumber,
                        isToday && { fontWeight: "700", color: colors.ink },
                        future && { color: "rgba(141,135,121,0.5)" },
                      ]}
                    >
                      {keyToDateTime(key).getDate()}
                    </Text>
                    <View style={styles.cellGlyph}>
                      <StatusGlyph status={status} size={17} color={color} />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
            <Rubric>{t.legend.title}</Rubric>
            <View style={{ marginTop: 12, gap: 12 }}>
              <LegendRow status="alcohol" hint={t.legend.alcohol} />
              <LegendRow status="alcohol_free" hint={t.legend.alcohol_free} />
              <LegendRow status="unmarked" hint={t.legend.unmarked} />
            </View>
          </View>

          <View style={styles.summary}>
            <Rubric>{t.cal.summaryMonth}</Rubric>
            <View style={styles.summaryRow}>
              <SummaryCell value={stats.alcoholFree} label={t.cal.cFree} color={colors.mossDeep} />
              <SummaryCell value={stats.alcohol} label={t.cal.cAlcohol} color={colors.clayDeep} />
              <SummaryCell value={stats.unmarked} label={t.cal.cUnmarked} color={colors.ink} />
            </View>
            <Text style={[textStyle.note, { marginTop: 16 }]}>{t.cal.monthNote}</Text>
          </View>
        </>
      ) : (
        <>
          <View style={styles.navRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t.cal.prevYear}
              onPress={() => goYear(-1)}
              style={({ pressed }) => [styles.navButton, pressed && { backgroundColor: colors.paperDeep }]}
            >
              <ChevronIcon dir="left" />
            </Pressable>
            <View style={{ alignItems: "center" }}>
              <Rubric>
                {f(t.cal.inYear, { n: yearStats.total, days: daysWord(yearStats.total, locale) })}
              </Rubric>
              <Text style={styles.monthTitle}>{f(t.cal.yearLabel, { y: cursor.year })}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t.cal.nextYear}
              disabled={isCurrentYear}
              onPress={() => goYear(1)}
              style={({ pressed }) => [
                styles.navButton,
                pressed && !isCurrentYear && { backgroundColor: colors.paperDeep },
                isCurrentYear && { opacity: 0.35 },
              ]}
            >
              <ChevronIcon dir="right" />
            </Pressable>
          </View>

          <View style={styles.summary}>
            <Rubric>{f(t.cal.summaryYear, { y: cursor.year })}</Rubric>
            <View style={styles.summaryRow}>
              <SummaryCell value={yearStats.alcoholFree} label={t.cal.cFree} color={colors.mossDeep} />
              <SummaryCell value={yearStats.alcohol} label={t.cal.cAlcohol} color={colors.clayDeep} />
              <SummaryCell value={yearStats.unmarked} label={t.cal.cUnmarked} color={colors.ink} />
            </View>
          </View>

          <View style={{ paddingHorizontal: 16, gap: 12 }}>
            {yearMonths.map((m) => (
              <Pressable
                key={m.monthIndex}
                accessibilityRole="button"
                accessibilityLabel={f(t.cal.openMonth, {
                  month: formatMonthName(m.monthIndex, locale),
                  y: m.year,
                })}
                onPress={() => {
                  setCursor({ year: m.year, month: m.monthIndex });
                  setMode("month");
                }}
                style={styles.yearMonthCard}
              >
                <View style={styles.yearMonthHead}>
                  <Text style={styles.yearMonthTitle}>
                    {formatMonthName(m.monthIndex, locale)}
                  </Text>
                  <Text style={textStyle.note}>
                    {`${t.cal.cFree}: ${m.alcoholFree} · ${t.cal.cAlcohol}: ${m.alcohol} · ${t.cal.cUnmarked}: ${m.unmarked}`}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </>
      )}
      <Hairline />
    </ScrollView>
  );
}

function SummaryCell({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <View style={{ alignItems: "center", flex: 1, paddingHorizontal: 6 }}>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const CELL = { flexBasis: "14.2857%", flexGrow: 0, flexShrink: 0 } as const;

const styles = StyleSheet.create({
  modeRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  modeTab: {
    flex: 1,
    minHeight: 42,
    borderRadius: radius,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modeTabActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  modeTabIdle: { backgroundColor: "transparent", borderColor: colors.line },
  modeTabText: { fontSize: 14, fontWeight: "600" },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  navButton: {
    width: 46,
    height: 46,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  monthTitle: { fontFamily: fonts.display, fontSize: 26, color: colors.ink, marginTop: 2 },
  gridBorder: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line },
  row: { flexDirection: "row", flexWrap: "wrap" },
  weekday: {
    ...CELL,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.mute,
    paddingVertical: 8,
  },
  cell: {
    ...CELL,
    aspectRatio: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.lineSoft,
    padding: 6,
  },
  blank: { backgroundColor: colors.paperDeep, opacity: 0.5 },
  todayCell: { borderWidth: 2, borderColor: colors.ink },
  dayNumber: { fontSize: 12, color: colors.inkSoft, fontVariant: ["tabular-nums"] },
  cellGlyph: { flex: 1, alignItems: "center", justifyContent: "center" },
  summary: { paddingHorizontal: 20, paddingVertical: 22 },
  summaryRow: { flexDirection: "row", marginTop: 14 },
  summaryValue: { fontFamily: fonts.display, fontSize: 34, fontVariant: ["tabular-nums"] },
  summaryLabel: { fontSize: 12, color: colors.inkSoft, marginTop: 6, textAlign: "center" },
  yearMonthCard: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paperDeep,
    borderRadius: radius,
    padding: 14,
  },
  yearMonthHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  yearMonthTitle: { fontFamily: fonts.display, fontSize: 19, color: colors.ink },
});
