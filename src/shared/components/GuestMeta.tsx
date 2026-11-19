"use client";

import { cn } from "cn";

import { RELATION_LABELS, SIDE_LABELS } from "@/shared/lib/constants";
import { RELATIONS, SIDES, type Relation, type Side } from "@/shared/lib/schemas/entry";

export const sideTone = {
  groom: {
    text: "text-groom",
    bg: "bg-groom",
    soft: "bg-groom-soft",
    ring: "ring-groom/40",
  },
  bride: {
    text: "text-bride",
    bg: "bg-bride",
    soft: "bg-bride-soft",
    ring: "ring-bride/40",
  },
} as const;

export function SidePicker({
  value,
  onChange,
  error,
}: {
  value: Side | null;
  onChange: (side: Side) => void;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div
        role="radiogroup"
        aria-label="신랑측 신부측"
        className={cn(
          "grid grid-cols-2 gap-1 rounded-2xl border bg-surface p-1",
          error && "border-destructive/50",
        )}
      >
        {SIDES.map((side) => {
          const active = value === side;
          return (
            <button
              key={side}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(side)}
              className={cn(
                "flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-card text-foreground shadow-soft ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full transition-opacity",
                  sideTone[side].bg,
                  active ? "opacity-100" : "opacity-40",
                )}
              />
              {SIDE_LABELS[side]}
            </button>
          );
        })}
      </div>
      {error ? <p className="text-[13px] text-destructive">{error}</p> : null}
    </div>
  );
}

export function RelationPicker({
  value,
  onChange,
}: {
  value: Relation | null;
  onChange: (relation: Relation | null) => void;
}) {
  return (
    <div role="radiogroup" aria-label="관계" className="flex flex-wrap gap-1.5">
      {RELATIONS.map((relation) => {
        const active = value === relation;
        return (
          <button
            key={relation}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(active ? null : relation)}
            className={cn(
              "h-8 rounded-full border px-3 text-[13px] transition-all active:scale-95",
              active
                ? "border-primary/60 bg-brand-soft font-medium text-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {RELATION_LABELS[relation]}
          </button>
        );
      })}
    </div>
  );
}

export function SideLabel({ side, className }: { side: Side | null; className?: string }) {
  if (!side) return null;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs", sideTone[side].text, className)}>
      <span className={cn("size-1.5 rounded-full", sideTone[side].bg)} />
      {SIDE_LABELS[side]}
    </span>
  );
}

export function RelationTag({ relation }: { relation: Relation | null }) {
  if (!relation) return null;
  return (
    <span className="inline-flex h-5 items-center rounded-full border border-border px-2 text-[11px] text-muted-foreground">
      {RELATION_LABELS[relation]}
    </span>
  );
}

export function GuestAvatar({
  name,
  side,
  size = "md",
}: {
  name: string;
  side: Side | null;
  size?: "md" | "lg";
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-bold",
        side ? cn(sideTone[side].soft, sideTone[side].text) : "bg-muted text-muted-foreground",
        size === "lg" ? "size-14 text-xl" : "size-10 text-[15px]",
      )}
    >
      {name.trim().charAt(0) || "?"}
    </span>
  );
}
