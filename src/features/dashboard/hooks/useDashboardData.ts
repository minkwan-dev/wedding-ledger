"use client";

import { useMemo } from "react";

import { AMOUNT_BUCKETS, RELATION_LABELS } from "@/shared/lib/constants";
import { RELATIONS, type Entry, type Side } from "@/shared/lib/schemas/entry";

export type Breakdown = {
  key: string;
  label: string;
  groom: number;
  bride: number;
  none: number;
  count: number;
  amount: number;
};

export type SideSummary = { count: number; amount: number };

function summarize(list: Entry[]): SideSummary {
  return { count: list.length, amount: list.reduce((sum, entry) => sum + entry.amount, 0) };
}

function countBySide(list: Entry[]) {
  return {
    groom: list.filter((entry) => entry.side === "groom").length,
    bride: list.filter((entry) => entry.side === "bride").length,
    none: list.filter((entry) => !entry.side).length,
    count: list.length,
    amount: list.reduce((sum, entry) => sum + entry.amount, 0),
  };
}

export function useDashboardData(entries: Entry[]) {
  return useMemo(() => {
    const total = summarize(entries);
    const sides: Record<Side, SideSummary> = {
      groom: summarize(entries.filter((entry) => entry.side === "groom")),
      bride: summarize(entries.filter((entry) => entry.side === "bride")),
    };
    const unassigned = summarize(entries.filter((entry) => !entry.side));
    const averageAmount = total.count ? Math.round(total.amount / total.count) : 0;
    const maxAmount = entries.reduce((max, entry) => Math.max(max, entry.amount), 0);
    // eslint-disable-next-line react-hooks/purity -- 통계 계산 시점 기준
    const hourAgo = Date.now() - 60 * 60 * 1000;
    const lastHourCount = entries.filter(
      (entry) => new Date(entry.created_at).getTime() >= hourAgo,
    ).length;

    const byRelation: Breakdown[] = [...RELATIONS, null]
      .map((relation) => ({
        key: relation ?? "none",
        label: relation ? RELATION_LABELS[relation] : "미분류",
        ...countBySide(entries.filter((entry) => (entry.relation ?? null) === relation)),
      }))
      .filter((row) => row.count > 0);

    const byAmount: Breakdown[] = AMOUNT_BUCKETS.map((bucket) => ({
      key: bucket.label,
      label: bucket.label,
      ...countBySide(
        entries.filter((entry) => entry.amount >= bucket.min && entry.amount < bucket.max),
      ),
    }));

    return {
      total,
      sides,
      unassigned,
      averageAmount,
      maxAmount,
      lastHourCount,
      byRelation,
      byAmount,
    };
  }, [entries]);
}
