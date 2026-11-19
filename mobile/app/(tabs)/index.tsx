import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDaysData } from "../../src/state/DaysProvider";
import { addDaysKey, formatDayLong, formatDayShort, formatMonthYear, keyToDateTime } from "../../src/core/dates";
import { buildDaySequence } from "../../src/core/streaks";
import { daysWord } from "../../src/core/plural";
import type { DayRecord } from "../../src/core/types";
import { useI18n } from "../../src/i18n/context";
import { colors, fonts, radius } from "../../src/theme";
import { Hairline, Rubric, StampButton, StatusStamp, textStyle } from "../../src/components/ui";
import { BottleIcon, LeafIcon, PencilIcon, RingIcon, TrashIcon } from "../../src/components/Icons";

const THREAD_DAYS = 24;

function Thread({ records, today }: { records: DayRecord[]; today: string }) {
  const { t, locale, fmt: f } = useI18n();
  const days = buildDaySequence(records, addDaysKey(today, -(THREAD_DAYS - 1)), today);
  return (
    <View style={styles.threadWrap}>
      <Rubric>{f(t.today.thread, { n: THREAD_DAYS })}</Rubric>
      <View style={styles.threadRow}>
        {days.map((d) => (
          <View key={d.date} style={styles.threadCell}>
            <View
              style={{
                height: 15,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {d.status === "alcohol" ? (
                <BottleIcon size={13} color={colors.clay} />
              ) : d.status === "alcohol_free" ? (
                <LeafIcon size={13} color={colors.moss} />
              ) : (
                <RingIcon size={13} color={colors.paperEdge} />
              )}
            </View>
            <View
              style={[
                styles.threadBar,
                d.status === "alcohol"
                  ? { backgroundColor: colors.clay }
                  : d.status === "alcohol_free"
                    ? { backgroundColor: colors.moss }
                    : { backgroundColor: colors.paperEdge },
              ]}
            />
            <Text
              accessible={true}
              accessibilityLabel={`${formatDayShort(d.date, locale)} — ${t.status[d.status ?? "unmarked"]}`}
              style={styles.srText}
            >
              {t.status[d.status ?? "unmarked"]}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.threadLabels}>
        <Text style={textStyle.note}>{formatDayShort(days[0].date, locale)}</Text>
        <Text style={textStyle.note}>
          {f(t.today.todayLabel, { date: formatDayShort(today, locale) })}
        </Text>
      </View>
    </View>
  );
}

export default function TodayScreen() {
  const { t, locale, fmt: f } = useI18n();
  const { today, records, map, info, setDay, removeDay } = useDaysData();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const record = map.get(today);
  const view = record?.status ?? "unmarked";
  const isEmpty = records.length === 0;
  const dayNumber = keyToDateTime(today).getDate();

  const openEditor = () => router.push(`/edit/${today}`);

  return (
    <ScrollView
      style={{ backgroundColor: colors.paper }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 140 }]}
      contentInsetAdjustmentBehavior="never"
    >
      <View style={styles.pad}>
        <Rubric>{f(t.today.onDay, { date: formatDayLong(today, locale) })}</Rubric>

        <View style={styles.dateRow}>
          <View>
            <Text style={styles.bigNumber}>{dayNumber}</Text>
            <Rubric style={{ marginTop: 10, color: colors.inkSoft }}>
              {formatMonthYear(today, locale)}
            </Rubric>
          </View>
          <View style={{ marginBottom: 4 }}>
            <StatusStamp status={view} />
          </View>
        </View>
      </View>

      <View style={[styles.pad, { marginTop: 22 }]}>
        <Hairline />
        <View style={{ marginTop: 16, gap: 10 }}>
          {!record ? (
            <>
              <StampButton
                variant="primary"
                onPress={() => void setDay(today, "alcohol_free")}
                accessibilityLabel="Отметить сегодняшний день как день без алкоголя"
              >
                <LeafIcon size={18} color={colors.paper} />
                <Text style={[styles.buttonText, { color: colors.paper }]}>{t.today.markFree}</Text>
              </StampButton>
              <StampButton
                variant="clay"
                onPress={() => void setDay(today, "alcohol")}
                accessibilityLabel="Отметить сегодняшний день как день с алкоголем"
              >
                <BottleIcon size={18} color={colors.clayDeep} />
                <Text style={[styles.buttonText, { color: colors.clayDeep }]}>{t.today.markAlcohol}</Text>
              </StampButton>
              <Text style={[textStyle.soft, { marginTop: 4 }]}>
                {t.today.unmarkedNote}
              </Text>
            </>
          ) : (
            <>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <StampButton variant="outline" style={{ flex: 1 }} onPress={openEditor}>
                  <PencilIcon size={16} color={colors.ink} />
                  <Text style={styles.buttonText}>{t.today.edit}</Text>
                </StampButton>
                <StampButton variant="ghost" style={{ flex: 1 }} onPress={() => void removeDay(today)}>
                  <TrashIcon size={16} color={colors.inkSoft} />
                  <Text style={[styles.buttonText, { color: colors.inkSoft }]}>{t.today.delete}</Text>
                </StampButton>
              </View>
              {record.note ? (
                <View style={styles.noteBlock}>
                  <Rubric>{t.today.note}</Rubric>
                  <Text style={[textStyle.body, { marginTop: 4 }]}>{record.note}</Text>
                </View>
              ) : (
                <StampButton variant="ghost" style={{ justifyContent: "flex-start", paddingHorizontal: 0 }} onPress={openEditor}>
                  <PencilIcon size={16} color={colors.inkSoft} />
                  <Text style={[styles.buttonText, { color: colors.inkSoft }]}>{t.today.addNote}</Text>
                </StampButton>
              )}
            </>
          )}
        </View>
      </View>

      {isEmpty && (
        <View style={[styles.pad, { marginTop: 24 }]}>
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>{t.today.emptyTitle}</Text>
            <Text style={[textStyle.soft, { marginTop: 6 }]}>
              {t.today.emptyText}
            </Text>
          </View>
        </View>
      )}

      <View style={[styles.pad, styles.streakBox]}>
        <Rubric>{t.today.currentStreak}</Rubric>
        <View style={styles.streakRow}>
          <Text style={styles.streakNumber}>{info.current}</Text>
          <Text style={styles.streakCaption}>
            {`${daysWord(info.current, locale)} ${t.today.streakAfter}\n${t.today.streakOf}`}
          </Text>
        </View>
        <Text style={[textStyle.soft, { marginTop: 12, maxWidth: 420 }]}>
          {!record
            ? t.today.noteUnmarked
            : record.status === "alcohol"
              ? t.today.noteAlcohol
              : t.today.noteFree}
        </Text>
      </View>

      <View style={[styles.pad, styles.threadSection]}>
        <Thread records={records} today={today} />
      </View>

      <View style={[styles.pad, { paddingTop: 24 }]}>
        <View style={styles.bestRow}>
          <Rubric style={{ maxWidth: 190 }}>{t.today.longest}</Rubric>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
            <Text style={styles.bestNumber}>{info.longest}</Text>
            <Text style={textStyle.soft}>{daysWord(info.longest, locale)}</Text>
          </View>
        </View>
        <Hairline style={{ marginVertical: 16 }} />
        <Text style={textStyle.note}>
          {t.today.seriesNote}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1 },
  pad: { paddingHorizontal: 20 },
  bigNumber: {
    fontFamily: fonts.display,
    fontSize: 108,
    lineHeight: 116,
    color: colors.ink,
    letterSpacing: -2,
  },
  dateRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: 16,
  },
  buttonText: { fontSize: 15, fontWeight: "600", color: colors.ink },
  noteBlock: { borderLeftWidth: 2, borderLeftColor: "rgba(30,33,25,0.25)", paddingLeft: 12 },
  emptyBox: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paperDeep,
    borderRadius: radius,
    padding: 18,
  },
  emptyTitle: { fontFamily: fonts.display, fontSize: 24, color: colors.ink },
  streakBox: {
    marginTop: 28,
    backgroundColor: colors.paperDeep,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.line,
    paddingVertical: 24,
  },
  streakRow: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 12, flexWrap: "wrap" },
  streakNumber: {
    fontFamily: fonts.display,
    fontSize: 84,
    lineHeight: 92,
    color: colors.mossDeep,
    fontVariant: ["tabular-nums"],
  },
  streakCaption: { fontSize: 16, lineHeight: 22, color: colors.ink },
  threadSection: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line, marginTop: 0 },
  threadWrap: { paddingVertical: 20 },
  threadRow: { flexDirection: "row", alignItems: "flex-end", gap: 3, marginTop: 12 },
  threadCell: { flex: 1, alignItems: "center", gap: 6 },
  threadBar: { height: 3, alignSelf: "stretch", borderRadius: 1 },
  threadLabels: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  srText: { fontSize: 9, color: colors.mute, position: "absolute", opacity: 0 },
  bestRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", gap: 16 },
  bestNumber: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.ink,
    fontVariant: ["tabular-nums"],
  },
});
