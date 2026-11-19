import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, type ReactNode } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDaysData } from "../../src/state/DaysProvider";
import { formatDayLong, isFutureKey } from "../../src/core/dates";
import type { DayStatus } from "../../src/core/types";
import { useI18n } from "../../src/i18n/context";
import { colors, fonts, radius } from "../../src/theme";
import { Hairline, Rubric, StampButton, StatusStamp, textStyle } from "../../src/components/ui";
import { BottleIcon, LeafIcon, TrashIcon } from "../../src/components/Icons";

export default function EditDayScreen() {
  const params = useLocalSearchParams<{ date: string }>();
  const date = typeof params.date === "string" ? params.date : "";
  const { t, locale } = useI18n();
  const { today, map, setDay, removeDay } = useDaysData();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const record = map.get(date);
  const future = isFutureKey(date, today);
  const [status, setStatus] = useState<DayStatus | null>(record?.status ?? null);
  const [note, setNote] = useState(record?.note ?? "");
  const [busy, setBusy] = useState(false);

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return (
      <View style={styles.errorBox}>
        <Text style={textStyle.body}>{t.editor.futureText}</Text>
        <StampButton variant="outline" onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={textStyle.body}>Вернуться</Text>
        </StampButton>
      </View>
    );
  }

  const save = async () => {
    if (!status || future) return;
    setBusy(true);
    try {
      await setDay(date, status, note.trim() === "" ? null : note.trim());
      router.back();
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await removeDay(date);
      router.back();
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: colors.paper }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 32 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headRow}>
          <View style={{ flex: 1 }}>
            <Rubric>{t.editor.markOfDay}</Rubric>
            <Text style={styles.title}>{formatDayLong(date, locale)}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.editor.closeWindow}
            onPress={() => router.back()}
            style={({ pressed }) => [styles.close, pressed && { backgroundColor: colors.paperDeep }]}
          >
            <Text style={styles.closeText}>×</Text>
          </Pressable>
        </View>

        <Hairline style={{ marginTop: 16 }} />

        {future ? (
          <View style={{ marginTop: 20 }}>
            <Text style={[textStyle.body, { maxWidth: 420 }]}>{t.editor.futureText}</Text>
            <StampButton variant="outline" onPress={() => router.back()} style={{ marginTop: 18, width: "100%" }}>
              <Text style={textStyle.body}>{t.editor.understood}</Text>
            </StampButton>
          </View>
        ) : (
          <View style={{ marginTop: 20 }}>
            <Rubric>{t.editor.statusTitle}</Rubric>
            <View style={{ marginTop: 12, gap: 10 }}>
              <OptionCard
                active={status === "alcohol_free"}
                onPress={() => setStatus("alcohol_free")}
                title={t.statusLong.alcohol_free}
                hint={t.statusHint.alcohol_free}
                tone={colors.moss}
                pale={colors.mossPale}
                icon={<LeafIcon size={22} color={status === "alcohol_free" ? colors.mossDeep : colors.inkSoft} />}
              />
              <OptionCard
                active={status === "alcohol"}
                onPress={() => setStatus("alcohol")}
                title={t.statusLong.alcohol}
                hint={t.statusHint.alcohol}
                tone={colors.clay}
                pale={colors.clayPale}
                icon={<BottleIcon size={22} color={status === "alcohol" ? colors.clayDeep : colors.inkSoft} />}
              />
            </View>

            <View style={{ marginTop: 20 }}>
              <Rubric>{t.editor.noteLabel}</Rubric>
              <TextInput
                value={note}
                onChangeText={setNote}
                maxLength={400}
                multiline
                placeholder={t.editor.notePlaceholder}
                placeholderTextColor={colors.mute}
                accessibilityLabel="Заметка к дню"
                style={styles.input}
              />
            </View>

            <View style={{ marginTop: 20, gap: 10 }}>
              <StampButton variant="primary" disabled={!status || busy} onPress={() => void save()} style={{ width: "100%" }}>
                <Text style={[textStyle.body, { color: colors.paper, fontWeight: "600" }]}>
                  {record ? t.editor.saveEdit : t.editor.saveNew}
                </Text>
              </StampButton>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <StampButton variant="ghost" style={{ flex: 1 }} disabled={busy} onPress={() => router.back()}>
                  <Text style={[textStyle.body, { color: colors.inkSoft }]}>{t.settings.cancel}</Text>
                </StampButton>
                {record && (
                  <StampButton variant="clay" style={{ flex: 1 }} disabled={busy} onPress={() => void remove()}>
                    <TrashIcon size={16} color={colors.clayDeep} />
                    <Text style={[textStyle.body, { color: colors.clayDeep, fontWeight: "600" }]}>
                      {t.today.delete}
                    </Text>
                  </StampButton>
                )}
              </View>
            </View>

            {record && (
              <View style={{ marginTop: 20, alignItems: "flex-start" }}>
                <StatusStamp status={record.status} />
                <Text style={[textStyle.note, { marginTop: 12 }]}>{t.editor.changedNote}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function OptionCard({
  active,
  onPress,
  title,
  hint,
  tone,
  pale,
  icon,
}: {
  active: boolean;
  onPress: () => void;
  title: string;
  hint: string;
  tone: string;
  pale: string;
  icon: ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        active ? { borderColor: tone, backgroundColor: pale } : { borderColor: "rgba(30,33,25,0.2)" },
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={{ marginTop: 2 }}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionHint}>{hint}</Text>
      </View>
      <View
        style={[
          styles.radio,
          active
            ? { borderColor: tone, backgroundColor: tone }
            : { borderColor: "rgba(30,33,25,0.3)", backgroundColor: "transparent" },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  title: { fontFamily: fonts.display, fontSize: 25, color: colors.ink, marginTop: 6 },
  close: { width: 40, height: 40, borderRadius: radius, alignItems: "center", justifyContent: "center" },
  closeText: { fontSize: 24, color: colors.inkSoft, lineHeight: 26 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderRadius: radius,
    padding: 14,
    minHeight: 76,
  },
  optionTitle: { fontSize: 15, fontWeight: "700", color: colors.ink },
  optionHint: { fontSize: 12, color: colors.inkSoft, marginTop: 3 },
  radio: { width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(30,33,25,0.25)",
    borderRadius: radius,
    padding: 12,
    minHeight: 90,
    textAlignVertical: "top",
    fontSize: 15,
    lineHeight: 21,
    color: colors.ink,
    backgroundColor: colors.paper,
  },
  errorBox: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.paper, padding: 24 },
});
