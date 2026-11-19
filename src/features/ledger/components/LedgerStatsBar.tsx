"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "cn";

import { useDashboardData, type Breakdown } from "@/features/dashboard/hooks/useDashboardData";
import { sideTone } from "@/shared/components/GuestMeta";
import { useAmountMask } from "@/shared/hooks/useAmountMask";
import { useCountUp } from "@/shared/hooks/useCountUp";
import { SIDE_LABELS } from "@/shared/lib/constants";
import { formatKoreanAmount, formatNumber } from "@/shared/lib/format";
import { SIDES, type Entry } from "@/shared/lib/schemas/entry";

type LedgerStatsBarProps = {
  entries: Entry[];
  isLoading: boolean;
};

const MASK = "••••••";

export function LedgerStatsBar({ entries, isLoading }: LedgerStatsBarProps) {
  const stats = useDashboardData(entries);
  const { isMasked, toggleMask } = useAmountMask();
  const [view, setView] = useState<"relation" | "amount">("relation");
  const [scope, setScope] = useState<Scope>("all");
  const animatedTotal = useCountUp(stats.total.amount);
  const rows = view === "relation" ? stats.byRelation : stats.byAmount;

  return (
    <section
      aria-label="축의금 현황"
      className="grid overflow-hidden rounded-[28px] border bg-card lg:grid-cols-[1.25fr_1fr]"
    >
      <div className="flex flex-col gap-8 p-7 sm:p-10">
        <div className="flex items-center justify-between">
          <p className="text-[13px] tracking-wide text-muted-foreground">총 축의금</p>
          <button
            type="button"
            onClick={toggleMask}
            aria-pressed={!isMasked}
            aria-label={isMasked ? "금액 보기" : "금액 숨기기"}
            className="inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {isMasked ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            {isMasked ? "금액 보기" : "숨기기"}
          </button>
        </div>

        <div>
          {isLoading ? (
            <div className="skeleton h-16 w-72" />
          ) : (
            <>
              <p className="display-num text-[2.75rem] leading-none sm:text-6xl">
                {isMasked ? (
                  <span className="text-muted-foreground/40">{MASK}</span>
                ) : (
                  formatNumber(animatedTotal)
                )}
                <span className="ml-1.5 text-2xl font-semibold tracking-normal text-muted-foreground">
                  원
                </span>
              </p>
              <ul className="num mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground [&>li]:whitespace-nowrap [&>li+li]:before:mr-3 [&>li+li]:before:text-border [&>li+li]:before:content-['|']">
                <li>
                  {isMasked
                    ? "금액이 가려져 있어요"
                    : stats.total.amount
                      ? formatKoreanAmount(stats.total.amount)
                      : "아직 입력된 축의금이 없어요"}
                </li>
                <li>{formatNumber(stats.total.count)}명</li>
                <li>평균 {isMasked ? "••" : shortAmount(stats.averageAmount)}</li>
                <li>최근 1시간 {formatNumber(stats.lastHourCount)}건</li>
              </ul>
            </>
          )}
        </div>

        <div className="mt-auto space-y-3">
          <dl className="grid grid-cols-2 gap-3">
            {SIDES.map((side) => (
              <div key={side} className="rounded-2xl bg-surface px-4 py-3.5 sm:px-5 sm:py-4">
                <dt className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                  <span className={cn("size-1.5 rounded-full", sideTone[side].bg)} />
                  {SIDE_LABELS[side]}
                </dt>
                <dd className="display-num mt-1.5 text-xl sm:text-2xl">
                  {isLoading ? (
                    <span className="skeleton block h-7 w-24" />
                  ) : isMasked ? (
                    <span className="text-muted-foreground/40">••••</span>
                  ) : (
                    <>
                      {formatNumber(stats.sides[side].amount)}
                      <span className="ml-0.5 text-sm font-semibold tracking-normal text-muted-foreground">
                        원
                      </span>
                    </>
                  )}
                </dd>
                <dd className="num mt-0.5 text-xs text-muted-foreground">
                  {formatNumber(stats.sides[side].count)}명
                </dd>
              </div>
            ))}
          </dl>
          {stats.unassigned.count ? (
            <p className="text-xs text-muted-foreground/80">
              구분 미지정 {formatNumber(stats.unassigned.count)}명
            </p>
          ) : null}
        </div>
      </div>

      <div className="border-t bg-surface/50 p-7 sm:p-10 lg:border-t-0 lg:border-l">
        <div className="mb-6 flex items-center justify-between">
          <div role="tablist" className="flex gap-4 text-[13px]">
            {(
              [
                ["relation", "관계별"],
                ["amount", "금액대별"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={view === key}
                onClick={() => setView(key)}
                className={cn(
                  "relative pb-1 transition-colors",
                  view === key
                    ? "font-medium text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex rounded-full bg-muted p-0.5 text-xs">
            {SCOPES.map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={scope === key}
                onClick={() => setScope(key)}
                className={cn(
                  "flex h-7 items-center gap-1 rounded-full px-2.5 transition-all",
                  scope === key
                    ? "bg-card font-medium text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {key !== "all" ? (
                  <span className={cn("size-1.5 rounded-full", sideTone[key].bg)} />
                ) : null}
                {label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <ul className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <li key={i} className="skeleton h-4" />
            ))}
          </ul>
        ) : rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">데이터가 쌓이면 보여드릴게요</p>
        ) : (
          <BreakdownList rows={rows} scope={scope} keepEmpty={view === "amount"} />
        )}
      </div>
    </section>
  );
}

type Scope = "all" | "groom" | "bride";

const SCOPES = [
  ["all", "전체"],
  ["groom", "신랑측"],
  ["bride", "신부측"],
] as const;

function BreakdownList({
  rows,
  scope,
  keepEmpty,
}: {
  rows: Breakdown[];
  scope: Scope;
  keepEmpty: boolean;
}) {
  const valueOf = (row: Breakdown) => (scope === "all" ? row.count : row[scope]);
  const visible = keepEmpty ? rows : rows.filter((row) => valueOf(row) > 0);
  const total = visible.reduce((sum, row) => sum + valueOf(row), 0);
  const max = Math.max(1, ...visible.map(valueOf));
  const barClass = scope === "all" ? "bg-primary/80" : sideTone[scope].bg;

  if (total === 0) {
    return <p className="py-10 text-center text-sm text-muted-foreground">아직 데이터가 없어요</p>;
  }

  return (
    <ul key={scope} className="space-y-3.5">
      {visible.map((row, index) => {
        const value = valueOf(row);
        const share = Math.round((value / total) * 100);
        return (
          <li key={row.key} className="grid grid-cols-[5rem_1fr_4rem] items-center gap-3">
            <span className="truncate text-[13px] text-foreground/80">{row.label}</span>
            <span className="relative h-1.5 overflow-hidden rounded-full bg-muted">
              <span
                className={cn("absolute inset-y-0 left-0 animate-grow-x rounded-full", barClass)}
                style={{ width: `${(value / max) * 100}%`, animationDelay: `${index * 40}ms` }}
              />
            </span>
            <span className="num text-right text-[13px]">
              {formatNumber(value)}
              <span className="ml-1 text-[11px] text-muted-foreground">{share}%</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function shortAmount(amount: number) {
  if (!amount) return "0";
  if (amount >= 100_000_000) {
    const eok = amount / 100_000_000;
    return `${Number.isInteger(eok) ? formatNumber(eok) : eok.toFixed(1)}억`;
  }
  if (amount >= 10_000) {
    const man = amount / 10_000;
    return `${Number.isInteger(man) ? formatNumber(man) : man.toFixed(1)}만`;
  }
  return formatNumber(amount);
}
