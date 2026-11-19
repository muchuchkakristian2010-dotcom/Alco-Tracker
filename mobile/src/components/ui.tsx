import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import type { ReactNode } from "react";
import { colors, fonts, radius, rubric } from "../theme";
import type { DayView } from "../core/types";
import { VIEW_LABELS } from "../core/types";
import { BottleIcon, LeafIcon, RingIcon } from "./Icons";

export function Rubric({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.rubric, style]}>{children}</Text>;
}

export function Hairline({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.hairline, style]} />;
}

type ButtonVariant = "primary" | "outline" | "clay" | "ghost" | "danger";

export function StampButton({
  children,
  onPress,
  variant = "outline",
  disabled,
  style,
  accessibilityLabel,
}: {
  children: ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}) {
  const tone = VARIANTS[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        tone,
        pressed && !disabled && { opacity: 0.82, transform: [{ scale: 0.995 }] },
        disabled && { opacity: 0.4 },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const VARIANTS: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: colors.ink, borderColor: colors.ink },
  outline: { backgroundColor: "transparent", borderColor: "rgba(30,33,25,0.35)" },
  clay: { backgroundColor: "transparent", borderColor: colors.clay },
  ghost: { backgroundColor: "transparent", borderColor: "transparent" },
  danger: { backgroundColor: colors.clay, borderColor: colors.clay },
};

/** Статусный штамп: цвет + значок + подпись. */
export function StatusStamp({ status, style }: { status: DayView; style?: StyleProp<ViewStyle> }) {
  const tone =
    status === "alcohol"
      ? { borderColor: colors.clay, color: colors.clayDeep }
      : status === "alcohol_free"
        ? { borderColor: colors.moss, color: colors.mossDeep }
        : { borderColor: "rgba(30,33,25,0.3)", color: colors.inkSoft };

  return (
    <View
      accessibilityLabel={`Статус дня: ${VIEW_LABELS[status]}`}
      style={[
        styles.stamp,
        { borderColor: tone.borderColor, transform: [{ rotate: "-2deg" }] },
        style,
      ]}
    >
      {status === "alcohol" ? (
        <BottleIcon size={18} color={tone.color} />
      ) : status === "alcohol_free" ? (
        <LeafIcon size={18} color={tone.color} />
      ) : (
        <RingIcon size={18} color={tone.color} />
      )}
      <Text style={[styles.rubric, { color: tone.color }]}>{VIEW_LABELS[status]}</Text>
    </View>
  );
}

export function LegendRow({ status, hint }: { status: DayView; hint: string }) {
  const icon =
    status === "alcohol" ? (
      <BottleIcon size={17} color={colors.ink} />
    ) : status === "alcohol_free" ? (
      <LeafIcon size={17} color={colors.ink} />
    ) : (
      <RingIcon size={17} color={colors.ink} />
    );
  return (
    <View style={styles.legendRow}>
      <View style={{ marginTop: 2 }}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.legendLabel}>{VIEW_LABELS[status]}</Text>
        <Text style={styles.legendHint}>{hint}</Text>
      </View>
    </View>
  );
}

export const textStyle = StyleSheet.create({
  display: { fontFamily: fonts.display, color: colors.ink },
  body: { color: colors.ink, fontSize: 15, lineHeight: 22 },
  soft: { color: colors.inkSoft, fontSize: 14, lineHeight: 21 },
  note: { color: colors.mute, fontSize: 13, lineHeight: 19 },
  tnum: { fontVariant: ["tabular-nums"] as const },
});

const styles = StyleSheet.create({
  rubric: { ...rubric },
  hairline: { height: 1, width: "100%", backgroundColor: colors.line },
  button: {
    minHeight: 52,
    borderRadius: radius,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  stamp: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderRadius: radius,
    backgroundColor: colors.paper,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  legendRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  legendLabel: { fontSize: 14, fontWeight: "600", color: colors.ink },
  legendHint: { fontSize: 12, lineHeight: 17, color: colors.mute, marginTop: 2 },
});
