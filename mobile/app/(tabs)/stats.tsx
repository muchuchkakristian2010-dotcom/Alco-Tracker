import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDaysData } from "../../src/state/DaysProvider";
import { formatDayShort, formatMonthName, keyToDateTime } from "../../src/core/dates";
import { useI18n } from "../../src/i18n/context";
import {
  computePeriodStats,
  computeYearMonthlyStats,
  resolveRange,
  share,
  type PeriodKind,
} from "../../src/core/stats";
import { buildDaySequence } from "../../src/core/streaks";
import { daysWord } from "../../src/core/plural";
import type { DayView } from "../../src/core/types";
import { colors, fonts, radius } from "../../src/theme";
import { Hairline, Rubric, textStyle } from "../../src/components/ui";
import { StatusGlyph } from "../../src/components/Icons";

export default function StatsScreen() {
  const { t, locale, fmt: f } = useI18n();
  const { today, records } = useDaysData();
  const insets = useSafeAreaInsets();
  const [kind, setKind] = useState<PeriodKind>("week");
  const currentYear = Number(today.slice(0, 4));

  const range = useMemo(() => resolveRange(kind, today, new Date()), [kind, today]);
  const stats = useMemo(
    () => computePeriodStats(records, range.from, range.to),
    [records, range.from, range.to]
  );
  const days = useMemo(
    () => (kind === "year" ? [] : buildDaySequence(records, range.from, range.to)),
    [kind, records, range.from, range.to]
  );
  const yearMonths = useMemo(
    () => (kind === "year" ? computeYearMonthlyStats(records, currentYear) : []),
    [kind, records, currentYear]
  );

  const title = `${formatDayShort(range.from, locale)} — ${formatDayShort(range.to, locale)}`;

  return (
    <ScrollView
      style={{ backgroundColor: colors.paper }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
      contentInsetAdjustmentBehavior="never"
    >
      <View style={styles.pad}>
        <View style={styles.headRow}>
          <Rubric>{t.stats.rubric}</Rubric>
          <Text style={textStyle.note}>{t.stats[range.labelKey]}</Text>
        </View>

        <View style={styles.toggle}>
          {(["week", "month", "year"] as PeriodKind[]).map((k) => {
            const active = kind === k;
            return (
              <Pressable
                key={k}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setKind(k)}
                style={({ pressed }) => [
                  styles.tab,
                  active ? styles.tabActive : styles.tabIdle,
                  pressed && !active && { opacity: 0.75 },
                ]}
              >
                <Text style={[styles.tabText, { color: active ? colors.paper : colors.inkSoft }]}>
                  {k === "week" ? t.stats.week : k === "month" ? t.stats.month : t.stats.year}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.periodTitle}>{title}</Text>
          <Text style={[styles.rubricDark]}>{f(t.stats.total, { n: stats.total })}</Text>
        </View>
      </View>

      <View style={styles.counterBox}>
        <View style={styles.counterRow}>
          <Counter value={stats.alcoholFree} label={t.cal.cFree} status="alcohol_free" tone={colors.mossDeep} />
          <Counter value={stats.alcohol} label={t.cal.cAlcohol} status="alcohol" tone={colors.clayDeep} />
          <Counter value={stats.unmarked} label={t.cal.cUnmarked} status="unmarked" tone={colors.inkSoft} />
        </View>
      </View>

      <View style={styles.pad}>
        <Rubric>{t.stats.shareTitle}</Rubric>
        <View
          accessibilityLabel={`Без алкоголя ${stats.alcoholFree}, с алкоголем ${stats.alcohol}, не отмечено ${stats.unmarked} из ${stats.total} дней`}
          style={styles.bar}
        >
          {stats.alcoholFree > 0 && (
            <View style={{ width: `${share(stats.alcoholFree, stats.total)}%`, backgroundColor: colors.moss }} />
          )}
          {stats.alcohol > 0 && (
            <View style={{ width: `${share(stats.alcohol, stats.total)}%`, backgroundColor: colors.clay }} />
          )}
          {stats.unmarked > 0 && (
            <View style={[{ width: `${share(stats.unmarked, stats.total)}%` }, styles.unmarkedBar]} />
          )}
        </View>
        <View style={styles.barLegend}>
          <Text style={textStyle.note}>{f(t.stats.shareFree, { p: share(stats.alcoholFree, stats.total) })}</Text>
          <Text style={textStyle.note}>{f(t.stats.shareAlcohol, { p: share(stats.alcohol, stats.total) })}</Text>
          <Text style={textStyle.note}>{f(t.stats.shareUnmarked, { p: share(stats.unmarked, stats.total) })}</Text>
        </View>
        <Text style={[textStyle.note, { marginTop: 12 }]}>
          {f(t.stats.markedOf, {
            free: stats.alcoholFree,
            days: daysWord(stats.alcoholFree, locale),
            total: stats.total,
          })}{" "}
          {stats.unmarked > 0
            ? f(t.stats.restUnmarked, { n: stats.unmarked, days: daysWord(stats.unmarked, locale) })
            : t.stats.allMarked}
        </Text>
      </View>

      {kind === "year" ? (
        <View style={[styles.pad, styles.stripBox]}>
          <Rubric>{f(t.stats.byMonths, { y: currentYear })}</Rubric>
          <View style={{ marginTop: 12, gap: 10 }}>
            {yearMonths.map((m) => (
              <View key={m.monthIndex} style={styles.monthRow}>
                <View style={styles.monthHead}>
                  <Text style={{ color: colors.ink, fontWeight: "600" }}>{formatMonthName(m.monthIndex)}</Text>
                  <Text style={textStyle.note}>
                    без алк.: {m.alcoholFree} · алк.: {m.alcohol} · не отм.: {m.unmarked}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={[styles.pad, styles.stripBox]}>
          <Rubric>{kind === "week" ? t.stats.eachWeek : t.stats.eachMonth}</Rubric>
          <View style={styles.strip}>
            {days.map((d) => {
              const status: DayView = d.status ?? "unmarked";
              const num = keyToDateTime(d.date).getDate();
              const bg =
                status === "alcohol" ? colors.clayPale : status === "alcohol_free" ? colors.mossPale : colors.paper;
              const border =
                status === "alcohol"
                  ? "rgba(212,122,85,0.55)"
                  : status === "alcohol_free"
                    ? "rgba(92,163,119,0.55)"
                    : colors.lineSoft;
              const color = status === "alcohol" ? colors.clayDeep : status === "alcohol_free" ? colors.mossDeep : colors.mute;
              return (
                <View
                  key={d.date}
                  accessibilityLabel={f(t.stats.cellTitle, {
                    date: formatDayShort(d.date, locale),
                    status: t.status[status],
                  })}
                  style={[styles.stripCell, { backgroundColor: bg, borderColor: border }]}
                >
                  <StatusGlyph status={status} size={14} color={color} />
                  <Text style={[styles.stripNum, { color }]}>{num}</Text>
                </View>
              );
            })}
          </View>
          <Text style={[textStyle.note, { marginTop: 12 }]}>
            {t.stats.hintWeek}
          </Text>
        </View>
      )}

      {records.length === 0 && (
        <View style={styles.pad}>
          <Hairline />
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>{t.stats.emptyTitle}</Text>
            <Text style={[textStyle.soft, { marginTop: 6 }]}>{t.stats.emptyText}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function Counter({
  value,
  label,
  status,
  tone,
}: {
  value: number;
  label: string;
  status: DayView;
  tone: string;
}) {
  return (
    <View style={{ flex: 1, alignItems: "center", paddingHorizontal: 6 }}>
      <StatusGlyph status={status} size={15} color={tone} />
      <Text style={[styles.counterValue, { color: tone }]}>{value}</Text>
      <Text style={styles.counterLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingTop: 20 },
  headRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  toggle: { flexDirection: "row", gap: 8, marginTop: 12 },
  tab: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  tabActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  tabIdle: { backgroundColor: "transparent", borderColor: colors.line },
  tabText: { fontSize: 15, fontWeight: "600" },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 18,
    gap: 12,
  },
  periodTitle: { fontFamily: fonts.display, fontSize: 22, color: colors.ink },
  rubricDark: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: colors.mute,
    fontVariant: ["tabular-nums"],
  },
  counterBox: {
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paperDeep,
    paddingVertical: 20,
  },
  counterRow: { flexDirection: "row" },
  counterValue: {
    fontFamily: fonts.display,
    fontSize: 40,
    lineHeight: 46,
    marginTop: 6,
    fontVariant: ["tabular-nums"],
  },
  counterLabel: { fontSize: 12, color: colors.inkSoft, marginTop: 4, textAlign: "center" },
  bar: {
    flexDirection: "row",
    height: 20,
    marginTop: 12,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
  },
  unmarkedBar: {
    backgroundColor: colors.paperDeep,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderLeftColor: colors.paperEdge,
    borderRightColor: colors.paperEdge,
  },
  barLegend: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 8 },
  stripBox: { marginTop: 22, borderTopWidth: 1, borderColor: colors.line, paddingVertical: 20 },
  strip: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 12 },
  stripCell: {
    flexBasis: "13%",
    flexGrow: 0,
    flexShrink: 0,
    aspectRatio: 1,
    borderRadius: radius,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  stripNum: { fontSize: 9, fontVariant: ["tabular-nums"] },
  monthRow: {
    borderWidth: 1,
    borderColor: colors.lineSoft,
    backgroundColor: colors.paperDeep,
    borderRadius: radius,
    padding: 12,
  },
  monthHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  empty: { borderLeftWidth: 2, borderLeftColor: colors.line, paddingLeft: 12, marginTop: 14 },
  emptyTitle: { fontFamily: fonts.display, fontSize: 21, color: colors.ink },
});
