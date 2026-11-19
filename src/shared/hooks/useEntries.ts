"use client";

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";

import type { Entry } from "@/shared/lib/schemas/entry";

type UseEntriesResult = {
  entries: Entry[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setEntries: Dispatch<SetStateAction<Entry[]>>;
};

export function useEntries(): UseEntriesResult {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 최초 로딩만 스켈레톤을 보여주고, 이후 갱신은 조용히 반영한다.
  const refetch = useCallback(async () => {
    setError(null);

    try {
      const response = await fetch("/api/entries", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "목록을 불러오지 못했습니다.");
      }

      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 초기 데이터 로드
    void refetch();
  }, [refetch]);

  useEffect(() => {
    const onFocus = () => {
      if (document.visibilityState === "visible") void refetch();
    };
    document.addEventListener("visibilitychange", onFocus);
    return () => document.removeEventListener("visibilitychange", onFocus);
  }, [refetch]);

  return { entries, isLoading, error, refetch, setEntries };
}
