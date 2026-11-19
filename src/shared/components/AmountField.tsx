"use client";

import type { Ref } from "react";
import { cn } from "cn";

import { AMOUNT_PRESETS, AMOUNT_STEPS } from "@/shared/lib/constants";
import { formatKoreanAmount, formatNumber } from "@/shared/lib/format";

type AmountFieldProps = {
  id: string;
  value: string;
  onChange: (digits: string) => void;
  onAddStep?: (value: number) => void;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
  size?: "default" | "lg";
};

export function AmountField({
  id,
  value,
  onChange,
  onAddStep,
  error,
  inputRef,
  size = "default",
}: AmountFieldProps) {
  const numeric = Number(value) || 0;
  const display = value ? formatNumber(numeric) : "";

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "group/amount relative flex items-center rounded-xl border bg-card transition-[border-color,box-shadow] focus-within:border-brand/60 focus-within:ring-4 focus-within:ring-brand/12",
          error ? "border-destructive/60" : "border-input",
        )}
      >
        <input
          ref={inputRef}
          id={id}
          inputMode="numeric"
          autoComplete="off"
          value={display}
          onChange={(event) => onChange(event.target.value)}
          placeholder="0"
          aria-invalid={Boolean(error)}
          aria-describedby={`${id}-hint`}
          className={cn(
            "num w-full min-w-0 bg-transparent pr-10 pl-4 text-right font-semibold outline-none placeholder:text-muted-foreground/50",
            size === "lg" ? "h-14 text-2xl" : "h-11 text-lg",
          )}
        />
        <span className="pointer-events-none absolute right-4 text-base font-medium text-muted-foreground">
          원
        </span>
      </div>

      <p
        id={`${id}-hint`}
        className={cn(
          "min-h-5 text-right text-[13px] transition-colors",
          error ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {error ?? (numeric ? formatKoreanAmount(numeric) : " ")}
      </p>

      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
        {AMOUNT_PRESETS.map((preset) => {
          const active = numeric === preset.value;
          return (
            <button
              key={preset.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(String(preset.value))}
              className={cn(
                "num h-9 rounded-lg border text-sm font-medium transition-all active:scale-95",
                active
                  ? "border-primary/60 bg-brand-soft font-semibold text-primary"
                  : "border-border bg-card hover:border-primary/40 hover:bg-muted",
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {onAddStep ? (
        <div className="flex items-center gap-1.5">
          {AMOUNT_STEPS.map((step) => (
            <button
              key={step.value}
              type="button"
              onClick={() => onAddStep(step.value)}
              className="num h-7 rounded-full bg-muted px-3 text-xs font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-95"
            >
              {step.label}
            </button>
          ))}
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="ml-auto h-7 rounded-full px-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              지우기
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
