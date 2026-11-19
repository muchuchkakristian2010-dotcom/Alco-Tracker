import type { DayView } from "../core/types";

type IconProps = { size?: number; className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Бутылочка — день с алкоголем. */
export function BottleIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path
        {...base}
        d="M10.1 2.4h3.8v3.9c0 1.1.4 1.7 1.2 2.5 1.5 1.4 2.4 3.1 2.4 5.3v6.1c0 1-.8 1.8-1.8 1.8H8.3c-1 0-1.8-.8-1.8-1.8v-6.1c0-2.2.9-3.9 2.4-5.3.8-.8 1.2-1.4 1.2-2.5V2.4Z"
      />
      <path {...base} strokeWidth={1.4} d="M6.7 13.6h10.6M6.7 17h10.6" />
    </svg>
  );
}

/** Листик — день без алкоголя. */
export function LeafIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path
        {...base}
        d="M19.6 4.3c.4 9.1-4.9 14.9-12.4 15.4-.8.1-1.5-.1-2.1-.4C5.6 11.6 10.6 4.9 19.6 4.3Z"
      />
      <path {...base} strokeWidth={1.4} d="M5.4 19.7c2.7-3.7 6-6.9 9.9-9.6" />
    </svg>
  );
}

/** Пустое кольцо — день не отмечен. */
export function RingIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="7.6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeDasharray="2.6 3.2" />
    </svg>
  );
}

export function StatusGlyph({
  status,
  size = 16,
  className,
}: {
  status: DayView;
  size?: number;
  className?: string;
}) {
  if (status === "alcohol") return <BottleIcon size={size} className={className} />;
  if (status === "alcohol_free") return <LeafIcon size={size} className={className} />;
  return <RingIcon size={size} className={className} />;
}

/* ——— иконки нижней навигации ——— */

export function TodayTabIcon({ size = 22, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.4" {...base} />
      <circle cx="12" cy="12" r="3.1" fill="currentColor" />
    </svg>
  );
}

export function CalendarTabIcon({ size = 22, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <rect x="3.6" y="5" width="16.8" height="15.4" rx="1.4" {...base} />
      <path {...base} d="M3.6 9.6h16.8M8.2 3.4v3.2M15.8 3.4v3.2" />
      <g fill="currentColor">
        <rect x="7.2" y="12.4" width="2.2" height="2.2" />
        <rect x="11" y="12.4" width="2.2" height="2.2" />
        <rect x="14.8" y="12.4" width="2.2" height="2.2" />
        <rect x="7.2" y="16.2" width="2.2" height="2.2" />
        <rect x="11" y="16.2" width="2.2" height="2.2" />
      </g>
    </svg>
  );
}

export function StatsTabIcon({ size = 22, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <g fill="currentColor">
        <rect x="4" y="13.4" width="3.6" height="7" />
        <rect x="10.2" y="8.4" width="3.6" height="12" />
        <rect x="16.4" y="4.4" width="3.6" height="16" />
      </g>
    </svg>
  );
}

export function SettingsTabIcon({ size = 22, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path {...base} d="M4 7.4h16M4 12h16M4 16.6h16" />
      <circle cx="9.4" cy="7.4" r="2.3" {...base} fill="var(--color-paper)" />
      <circle cx="15.2" cy="12" r="2.3" {...base} fill="var(--color-paper)" />
      <circle cx="8" cy="16.6" r="2.3" {...base} fill="var(--color-paper)" />
    </svg>
  );
}

export function ChevronIcon({ size = 18, className, dir = "left" }: IconProps & { dir?: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      style={{ transform: dir === "right" ? "rotate(180deg)" : undefined }}
    >
      <path {...base} d="M14.5 5.5 8 12l6.5 6.5" />
    </svg>
  );
}

export function TrashIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path {...base} d="M4.8 6.8h14.4M9.4 6.8V4.6h5.2v2.2M6.6 6.8l.9 12.2c.1.9.8 1.6 1.7 1.6h5.6c.9 0 1.6-.7 1.7-1.6l.9-12.2" />
      <path {...base} strokeWidth={1.4} d="M10.4 10.6v6.4M13.6 10.6v6.4" />
    </svg>
  );
}

export function PencilIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path {...base} d="M16.6 4.6 19.4 7.4 8.8 18l-3.6.8.8-3.6L16.6 4.6Z" />
      <path {...base} strokeWidth={1.4} d="M14.6 6.6 17.4 9.4" />
    </svg>
  );
}

export function MoonIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path
        {...base}
        d="M20.2 14.4A8.2 8.2 0 0 1 9.6 3.8a8.2 8.2 0 1 0 10.6 10.6Z"
      />
    </svg>
  );
}

export function SunIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" {...base} />
      <path
        {...base}
        d="M12 2.5v2.3M12 19.2v2.3M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.3M19.2 12h2.3M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"
      />
    </svg>
  );
}
