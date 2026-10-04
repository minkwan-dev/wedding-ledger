"use client";

import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";
import { formatCurrency } from "@/shared/lib/format";
import type { Entry } from "@/shared/lib/schemas/entry";

type LedgerStatsBarProps = {
  entries: Entry[];
};

export function LedgerStatsBar({ entries }: LedgerStatsBarProps) {
  const { totalAmount, totalCount } = useDashboardData(entries);

  return (
    <div className="grid gap-6 border-y border-border/80 py-8 sm:grid-cols-2">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">총 축의금</p>
        <p className="font-heading text-3xl font-medium tracking-tight lg:text-4xl">
          {formatCurrency(totalAmount)}
        </p>
      </div>
      <div className="space-y-1 sm:border-l sm:border-border/80 sm:pl-8">
        <p className="text-sm text-muted-foreground">총 건수</p>
        <p className="font-heading text-3xl font-medium tracking-tight lg:text-4xl">
          {totalCount}
          <span className="ml-1 text-lg text-muted-foreground">건</span>
        </p>
      </div>
    </div>
  );
}
