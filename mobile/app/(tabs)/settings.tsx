import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDaysData } from "../../src/state/DaysProvider";
import { daysWord } from "../../src/core/plural";
import { LOCALES } from "../../src/i18n/dict";
import { useI18n } from "../../src/i18n/context";
import { colors, fonts } from "../../src/theme";
import { Hairline, Rubric, StampButton, textStyle } from "../../src/components/ui";
import { TrashIcon } from "../../src/components/Icons";

export default function SettingsScreen() {
  const { t, locale, fmt: f } = useI18n();
  const { records, clearAll, locale: activeLocale, setLocale } = useDaysData();
  const insets = useSafeAreaInsets();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

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

  return (
    <ScrollView
      style={{ backgroundColor: colors.paper }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
      contentInsetAdjustmentBehavior="never"
    >
      <View style={styles.pad}>
        <Rubric>{t.settings.language}</Rubric>
        <View style={styles.langRow}>
          {LOCALES.map((code) => {
            const active = activeLocale === code;
            return (
              <Pressable
                key={code}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={code === "ru" ? t.settings.langRu : code === "uk" ? t.settings.langUk : t.settings.langEn}
                onPress={() => setLocale(code)}
                style={[
                  styles.langTab,
                  active ? styles.langTabActive : styles.langTabIdle,
                ]}
              >
                <Text style={[styles.langText, { color: active ? colors.paper : colors.inkSoft }]}>
                  {code === "ru" ? t.settings.langRu : code === "uk" ? t.settings.langUk : t.settings.langEn}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.pad}>
        <Rubric>{t.settings.storage}</Rubric>
        <Text style={[textStyle.body, { marginTop: 12, maxWidth: 460 }]}>
          {t.settings.storageText}
        </Text>
      </View>

      <View style={[styles.pad, { marginTop: 24 }]}>
        <Hairline />
        <View style={styles.factRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.factValue}>{records.length}</Text>
            <Text style={styles.factLabel}>
              {f(t.settings.records, { days: daysWord(records.length, locale) })}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.factValue}>0</Text>
            <Text style={styles.factLabel}>{t.settings.zeroServers}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.pad, { marginTop: 28 }]}>
        <Hairline />
        <View style={{ marginTop: 16 }}>
          <Rubric>{t.settings.about}</Rubric>
          <Text style={[textStyle.soft, { marginTop: 12, maxWidth: 460 }]}>
            {f(t.settings.aboutText, { name: "Ясно" })}
          </Text>
        </View>
      </View>

      <View style={[styles.pad, styles.dangerBox]}>
        <Rubric style={{ color: colors.clay }}>{t.settings.manage}</Rubric>

        {!confirming ? (
          <View style={{ marginTop: 12 }}>
            <StampButton
              variant="outline"
              disabled={records.length === 0}
              onPress={() => {
                setDone(false);
                setConfirming(true);
              }}
              style={{ width: "100%" }}
            >
              <TrashIcon size={16} color={colors.clayDeep} />
              <Text style={[styles.buttonText, { color: colors.clayDeep }]}>{t.settings.clearAll}</Text>
            </StampButton>
            <Text style={[textStyle.note, { marginTop: 10 }]}>
              {records.length === 0 ? t.settings.clearHintEmpty : t.settings.clearHint}
            </Text>
          </View>
        ) : (
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>{t.settings.confirmTitle}</Text>
            <Text style={[textStyle.soft, { marginTop: 8 }]}>
              {f(t.settings.confirmText, { n: records.length, days: daysWord(records.length, locale) })}
            </Text>
            <View style={{ marginTop: 16, gap: 10 }}>
              <StampButton variant="danger" disabled={busy} onPress={() => void confirm()} style={{ width: "100%" }}>
                <Text style={[styles.buttonText, { color: colors.paper }]}>{t.settings.yesDelete}</Text>
              </StampButton>
              <StampButton variant="ghost" disabled={busy} onPress={() => setConfirming(false)} style={{ width: "100%" }}>
                <Text style={[styles.buttonText, { color: colors.inkSoft }]}>{t.settings.cancel}</Text>
              </StampButton>
            </View>
          </View>
        )}

        {done && !confirming && (
          <Text style={styles.doneText}>{t.settings.deleted}</Text>
        )}
      </View>

      <View style={[styles.pad, { paddingBottom: 8 }]}>
        <Text style={textStyle.note}>{f(t.settings.footer, { name: "Ясно" })}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingTop: 22 },
  langRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  langTab: {
    flex: 1,
    minHeight: 44,
    borderRadius: 2,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  langTabActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  langTabIdle: { backgroundColor: "transparent", borderColor: colors.line },
  langText: { fontSize: 14, fontWeight: "600" },
  factRow: { flexDirection: "row", gap: 16, marginTop: 16 },
  factValue: { fontFamily: fonts.display, fontSize: 34, color: colors.ink, fontVariant: ["tabular-nums"] },
  factLabel: { fontSize: 12, color: colors.inkSoft, marginTop: 6, maxWidth: 150, lineHeight: 17 },
  dangerBox: { marginTop: 28, borderTopWidth: 1, borderColor: colors.line },
  confirmBox: {
    marginTop: 12,
    borderWidth: 2,
    borderColor: colors.clay,
    backgroundColor: colors.clayPale,
    padding: 16,
    borderRadius: 2,
  },
  confirmTitle: { fontFamily: fonts.display, fontSize: 22, color: colors.ink },
  buttonText: { fontSize: 15, fontWeight: "600" },
  doneText: { marginTop: 12, fontSize: 14, color: colors.mossDeep, lineHeight: 20 },
});
