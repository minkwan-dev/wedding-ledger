"use client";

import { DashboardView } from "@/features/dashboard/components/DashboardView";
import { PageHeader } from "@/shared/components/PageHeader";
import { useEntries } from "@/shared/hooks/useEntries";

export default function DashboardPage() {
  const { entries, isLoading, error } = useEntries();

  return (
    <>
      <PageHeader
        title="현황"
        description="오늘 수령한 축의금을 한눈에 확인하세요."
      />
      <DashboardView entries={entries} isLoading={isLoading} error={error} />
    </>
  );
}
