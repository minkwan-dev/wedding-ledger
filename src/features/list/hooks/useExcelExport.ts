"use client";

import { useCallback, useState } from "react";

type UseExcelExportResult = {
  isExporting: boolean;
  error: string | null;
  exportExcel: () => Promise<void>;
};

export function useExcelExport(): UseExcelExportResult {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportExcel = useCallback(async () => {
    setIsExporting(true);
    setError(null);

    try {
      const response = await fetch("/api/entries/export");

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "엑셀 내보내기에 실패했습니다.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `축의금_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "엑셀 내보내기에 실패했습니다.");
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { isExporting, error, exportExcel };
}
