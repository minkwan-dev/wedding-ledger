"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useExcelExport } from "@/features/list/hooks/useExcelExport";
import { useToast } from "@/shared/components/Toaster";
import { useEntries } from "@/shared/hooks/useEntries";
import { formatCurrency } from "@/shared/lib/format";
import type { Entry } from "@/shared/lib/schemas/entry";

function sortByCreatedDesc(list: Entry[]) {
  return [...list].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function useLedgerPage() {
  const { entries, isLoading, error, refetch, setEntries } = useEntries();
  const excel = useExcelExport();
  const { toast } = useToast();
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const highlightTimer = useRef<number | undefined>(undefined);

  const flash = useCallback((id: string) => {
    setHighlightId(id);
    window.clearTimeout(highlightTimer.current);
    highlightTimer.current = window.setTimeout(() => setHighlightId(null), 2400);
  }, []);

  useEffect(() => () => window.clearTimeout(highlightTimer.current), []);

  useEffect(() => {
    if (excel.error) toast({ title: "내보내기 실패", description: excel.error, tone: "error" });
  }, [excel.error, toast]);

  const handleCreated = useCallback(
    (entry: Entry) => {
      setEntries((prev) => [entry, ...prev.filter((item) => item.id !== entry.id)]);
      flash(entry.id);
      toast({
        title: `${entry.guest_name}님 저장 완료`,
        description: formatCurrency(entry.amount),
        tone: "success",
      });
    },
    [flash, setEntries, toast],
  );

  const handleUpdated = useCallback(
    (entry: Entry) => {
      setEntries((prev) => prev.map((item) => (item.id === entry.id ? entry : item)));
      flash(entry.id);
      toast({ title: `${entry.guest_name}님 정보를 수정했어요`, tone: "success" });
    },
    [flash, setEntries, toast],
  );

  const restoreEntry = useCallback(
    async (entry: Entry) => {
      setEntries((prev) => sortByCreatedDesc([entry, ...prev.filter((i) => i.id !== entry.id)]));
      try {
        const response = await fetch(`/api/entries/${entry.id}/restore`, { method: "POST" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "복원에 실패했습니다.");
        setEntries((prev) => prev.map((item) => (item.id === data.id ? data : item)));
        flash(entry.id);
        toast({ title: `${entry.guest_name}님 항목을 되돌렸어요`, tone: "success" });
      } catch (err) {
        toast({
          title: "복원 실패",
          description: err instanceof Error ? err.message : undefined,
          tone: "error",
        });
        void refetch();
      }
    },
    [flash, refetch, setEntries, toast],
  );

  const deleteEntry = useCallback(
    async (entry: Entry) => {
      setEntries((prev) => prev.filter((item) => item.id !== entry.id));
      try {
        const response = await fetch(`/api/entries/${entry.id}`, { method: "DELETE" });
        const data = await response.json();
        if (response.status === 404) {
          // 다른 화면에서 이미 삭제된 항목: 목록만 최신으로 맞춘다.
          toast({ title: "이미 삭제된 항목이에요", tone: "info" });
          void refetch();
          return;
        }
        if (!response.ok) throw new Error(data.error ?? "삭제에 실패했습니다.");
        toast({
          title: `${entry.guest_name}님 항목을 삭제했어요`,
          description: formatCurrency(entry.amount),
          action: { label: "되돌리기", onClick: () => void restoreEntry(entry) },
        });
      } catch (err) {
        setEntries((prev) => sortByCreatedDesc([entry, ...prev]));
        toast({
          title: "삭제 실패",
          description: err instanceof Error ? err.message : undefined,
          tone: "error",
        });
      }
    },
    [refetch, restoreEntry, setEntries, toast],
  );

  return {
    entries,
    isLoading,
    error,
    refetch,
    excel,
    highlightId,
    handleCreated,
    handleUpdated,
    deleteEntry,
  };
}
