"use client";

import { Eye, EyeOff } from "lucide-react";

import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";
import { Button } from "@/shared/components/ui/button";
import { useAmountMask } from "@/shared/hooks/useAmountMask";
import { formatCurrency, maskCurrency } from "@/shared/lib/format";
import type { Entry } from "@/shared/lib/schemas/entry";

type LedgerStatsBarProps = {
  entries: Entry[];
};

export function LedgerStatsBar({ entries }: LedgerStatsBarProps) {
  const { totalAmount, totalCount } = useDashboardData(entries);
  const { isMasked, toggleMask } = useAmountMask();

  return (
    <div className="grid gap-6 border-y border-border/80 py-8 sm:grid-cols-2">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">총 축의금</p>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-foreground"
            aria-label={isMasked ? "총 축의금 보기" : "총 축의금 숨기기"}
            onClick={toggleMask}
          >
            {isMasked ? <EyeOff /> : <Eye />}
          </Button>
        </div>
        <p className="text-3xl font-semibold tracking-tight lg:text-4xl">
          {isMasked ? maskCurrency(totalAmount) : formatCurrency(totalAmount)}
        </p>
      </div>
      <div className="space-y-1 sm:border-l sm:border-border/80 sm:pl-8">
        <p className="text-sm text-muted-foreground">총 건수</p>
        <p className="text-3xl font-semibold tracking-tight lg:text-4xl">
          {totalCount}
          <span className="ml-1 text-lg text-muted-foreground">건</span>
        </p>
      </div>
    </div>
  );
}
