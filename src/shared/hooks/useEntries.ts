"use client";

import { useCallback, useEffect, useState } from "react";

import type { Entry } from "@/shared/lib/schemas/entry";

type UseEntriesResult = {
  entries: Entry[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useEntries(): UseEntriesResult {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/entries");
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
    void refetch();
  }, [refetch]);

  return { entries, isLoading, error, refetch };
}
