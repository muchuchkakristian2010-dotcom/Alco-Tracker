import Svg, { Circle, Path, Rect, G } from "react-native-svg";
import type { DayView } from "../core/types";

export type IconProps = { size?: number; color?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Бутылочка — день с алкоголем. */
export function BottleIcon({ size = 16, color = "currentColor" }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} color={color}>
      <Path
        d="M10.1 2.4h3.8v3.9c0 1.1.4 1.7 1.2 2.5 1.5 1.4 2.4 3.1 2.4 5.3v6.1c0 1-.8 1.8-1.8 1.8H8.3c-1 0-1.8-.8-1.8-1.8v-6.1c0-2.2.9-3.9 2.4-5.3.8-.8 1.2-1.4 1.2-2.5V2.4Z"
        {...stroke}
      />
      <Path d="M6.7 13.6h10.6M6.7 17h10.6" {...stroke} strokeWidth={1.4} />
    </Svg>
  );
}

/** Листик — день без алкоголя. */
export function LeafIcon({ size = 16, color = "currentColor" }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} color={color}>
      <Path
        d="M19.6 4.3c.4 9.1-4.9 14.9-12.4 15.4-.8.1-1.5-.1-2.1-.4C5.6 11.6 10.6 4.9 19.6 4.3Z"
        {...stroke}
      />
      <Path d="M5.4 19.7c2.7-3.7 6-6.9 9.9-9.6" {...stroke} strokeWidth={1.4} />
    </Svg>
  );
}

/** Пустое кольцо — день не отмечен. */
export function RingIcon({ size = 16, color = "currentColor" }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} color={color}>
      <Circle
        cx={12}
        cy={12}
        r={7.6}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeDasharray="2.6 3.2"
      />
    </Svg>
  );
}

export function StatusGlyph({ status, size = 16, color }: { status: DayView; size?: number; color?: string }) {
  if (status === "alcohol") return <BottleIcon size={size} color={color} />;
  if (status === "alcohol_free") return <LeafIcon size={size} color={color} />;
  return <RingIcon size={size} color={color} />;
}

export function TodayTabIcon({ size = 22, color = "currentColor" }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} color={color}>
      <Circle cx={12} cy={12} r={8.4} {...stroke} />
      <Circle cx={12} cy={12} r={3.1} fill={color} />
    </Svg>
  );
}

export function CalendarTabIcon({ size = 22, color = "currentColor" }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} color={color}>
      <Rect x={3.6} y={5} width={16.8} height={15.4} rx={1.4} {...stroke} />
      <Path d="M3.6 9.6h16.8M8.2 3.4v3.2M15.8 3.4v3.2" {...stroke} />
      <G fill={color}>
        <Rect x={7.2} y={12.4} width={2.2} height={2.2} />
        <Rect x={11} y={12.4} width={2.2} height={2.2} />
        <Rect x={14.8} y={12.4} width={2.2} height={2.2} />
        <Rect x={7.2} y={16.2} width={2.2} height={2.2} />
        <Rect x={11} y={16.2} width={2.2} height={2.2} />
      </G>
    </Svg>
  );
}

export function StatsTabIcon({ size = 22, color = "currentColor" }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} color={color}>
      <G fill={color}>
        <Rect x={4} y={13.4} width={3.6} height={7} />
        <Rect x={10.2} y={8.4} width={3.6} height={12} />
        <Rect x={16.4} y={4.4} width={3.6} height={16} />
      </G>
    </Svg>
  );
}

export function SettingsTabIcon({ size = 22, color = "currentColor" }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} color={color}>
      <Path d="M4 7.4h16M4 12h16M4 16.6h16" {...stroke} />
      <Circle cx={9.4} cy={7.4} r={2.3} {...stroke} fill="#131714" />
      <Circle cx={15.2} cy={12} r={2.3} {...stroke} fill="#131714" />
      <Circle cx={8} cy={16.6} r={2.3} {...stroke} fill="#131714" />
    </Svg>
  );
}

export function ChevronIcon({ size = 18, color = "currentColor", dir = "left" }: IconProps & { dir?: "left" | "right" }) {
  return (
    <Svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      color={color}
      style={dir === "right" ? { transform: [{ rotate: "180deg" }] } : undefined}
    >
      <Path d="M14.5 5.5 8 12l6.5 6.5" {...stroke} />
    </Svg>
  );
}

export function TrashIcon({ size = 16, color = "currentColor" }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} color={color}>
      <Path
        d="M4.8 6.8h14.4M9.4 6.8V4.6h5.2v2.2M6.6 6.8l.9 12.2c.1.9.8 1.6 1.7 1.6h5.6c.9 0 1.6-.7 1.7-1.6l.9-12.2"
        {...stroke}
      />
      <Path d="M10.4 10.6v6.4M13.6 10.6v6.4" {...stroke} strokeWidth={1.4} />
    </Svg>
  );
}

export function PencilIcon({ size = 16, color = "currentColor" }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} color={color}>
      <Path d="M16.6 4.6 19.4 7.4 8.8 18l-3.6.8.8-3.6L16.6 4.6Z" {...stroke} />
      <Path d="M14.6 6.6 17.4 9.4" {...stroke} strokeWidth={1.4} />
    </Svg>
  );
}

/** Знак приложения: оборванная нить с узелком. */
export function ThreadMark({ width = 28, color = "#3F6B52" }: { width?: number; color?: string }) {
  return (
    <Svg viewBox="0 0 28 14" width={width} height={width / 2} color={color}>
      <Path
        d="M1 9.5c4-5.4 7.6-5.4 11.2 0 3.6 5.4 7.2 5.4 10.8 0"
        fill="none"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <Circle cx={24.6} cy={4.4} r={2.4} fill={color} />
    </Svg>
  );
}
