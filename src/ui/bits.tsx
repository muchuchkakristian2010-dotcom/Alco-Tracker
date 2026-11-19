import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import type { DayView } from "../core/types";
import { useI18n } from "../i18n/context";
import { BottleIcon, LeafIcon, RingIcon } from "./Icons";

export function Rubric({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rubric text-mute", className)}>{children}</div>;
}

export function Hairline({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-ink/15", className)} />;
}

/** Кнопка-штамп: прямые углы, чернильная обводка, никаких «пилюль». */
export function StampButton({
  children,
  onClick,
  variant = "outline",
  className,
  disabled,
  ariaLabel,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "clay" | "ghost" | "danger";
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  type?: "button" | "submit";
}) {
  const styles: Record<string, string> = {
    primary: "bg-ink text-paper border border-ink hover:bg-moss-deep hover:border-moss-deep",
    outline: "border border-ink/35 text-ink hover:border-ink hover:bg-paper-deep",
    clay: "border border-clay text-clay-deep hover:bg-clay hover:text-paper hover:border-clay",
    ghost: "border border-transparent text-ink-soft hover:text-ink hover:bg-paper-deep",
    danger: "bg-clay text-paper border border-clay hover:bg-clay-deep hover:border-clay-deep",
  };
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "press inline-flex min-h-12 items-center justify-center gap-2 rounded-[2px] px-5 text-[0.95rem] font-medium",
        "disabled:cursor-not-allowed disabled:opacity-40",
        styles[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

/** Статусный штамп — подпись всегда есть, не только цвет. */
export function StatusStamp({ status, className }: { status: DayView; className?: string }) {
  const { t } = useI18n();
  const tone =
    status === "alcohol"
      ? "border-clay text-clay-deep"
      : status === "alcohol_free"
        ? "border-moss text-moss-deep"
        : "border-ink/30 text-ink-soft";
  return (
    <div
      role="status"
      className={cn(
        "anim-stamp inline-flex items-center gap-2 border-2 bg-paper px-3 py-2 rounded-[2px]",
        tone,
        className
      )}
      style={{ transform: "rotate(-2deg)" }}
    >
      {status === "alcohol" ? (
        <BottleIcon size={18} />
      ) : status === "alcohol_free" ? (
        <LeafIcon size={18} />
      ) : (
        <RingIcon size={18} />
      )}
      <span className="rubric">{t.status[status]}</span>
    </div>
  );
}
