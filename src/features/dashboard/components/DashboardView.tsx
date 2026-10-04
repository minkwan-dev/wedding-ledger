"use client";

import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";
import { Separator } from "@/shared/components/ui/separator";
import { formatCurrency, formatDateTime } from "@/shared/lib/format";
import type { Entry } from "@/shared/lib/schemas/entry";

type DashboardViewProps = {
  entries: Entry[];
  isLoading: boolean;
  error: string | null;
};

export function DashboardView({ entries, isLoading, error }: DashboardViewProps) {
  const { totalAmount, totalCount, recentEntries } = useDashboardData(entries);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">불러오는 중...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-10">
      <section className="space-y-6 border-b border-border/80 pb-10">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">총 축의금</p>
          <p className="font-heading text-4xl font-medium tracking-tight">
            {formatCurrency(totalAmount)}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">총 건수</p>
          <p className="font-heading text-2xl font-medium">{totalCount}건</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-medium">최근 입력</h2>
        {recentEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground">아직 입력된 축의금이 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {recentEntries.map((entry, index) => (
              <li key={entry.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-1">
                    <p className="truncate font-medium">{entry.guest_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(entry.created_at)}
                    </p>
                  </div>
                  <p className="shrink-0 font-medium">{formatCurrency(entry.amount)}</p>
                </div>
                {index < recentEntries.length - 1 ? <Separator className="mt-4" /> : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
