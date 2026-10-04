"use client";

import { useMemo } from "react";

import { RECENT_ENTRY_LIMIT } from "@/shared/lib/constants";
import type { Entry } from "@/shared/lib/schemas/entry";

type UseDashboardDataResult = {
  totalAmount: number;
  totalCount: number;
  recentEntries: Entry[];
};

export function useDashboardData(entries: Entry[]): UseDashboardDataResult {
  return useMemo(() => {
    const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);
    const totalCount = entries.length;
    const recentEntries = entries.slice(0, RECENT_ENTRY_LIMIT);

    return { totalAmount, totalCount, recentEntries };
  }, [entries]);
}
