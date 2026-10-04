"use client";

import { useCallback, useState } from "react";

import { useExcelExport } from "@/features/list/hooks/useExcelExport";
import { useEntries } from "@/shared/hooks/useEntries";
import { formatCurrency } from "@/shared/lib/format";

export function useLedgerPage() {
  const { entries, isLoading, error, refetch } = useEntries();
  const excel = useExcelExport();
  const [notice, setNotice] = useState<{ title: string; description: string } | null>(
    null,
  );

  const handleEntrySuccess = useCallback(
    async (guestName: string, amount: number) => {
      await refetch();
      setNotice({
        title: "저장 완료",
        description: `${guestName}님 ${formatCurrency(amount)}이 저장되었습니다.`,
      });
    },
    [refetch],
  );

  const showNotice = useCallback((title: string, description: string) => {
    setNotice({ title, description });
  }, []);

  const closeNotice = useCallback(() => {
    setNotice(null);
  }, []);

  return {
    entries,
    isLoading,
    error,
    refetch,
    excel,
    notice,
    handleEntrySuccess,
    showNotice,
    closeNotice,
  };
}
