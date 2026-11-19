"use client";

import { useMemo, useState } from "react";

import { PAGE_SIZE, RELATION_LABELS } from "@/shared/lib/constants";
import { matchesKorean } from "@/shared/lib/hangul";
import type { Entry, Side } from "@/shared/lib/schemas/entry";

export const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
  { value: "amount-desc", label: "금액 높은순" },
  { value: "amount-asc", label: "금액 낮은순" },
  { value: "name", label: "이름순" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

const time = (entry: Entry) => new Date(entry.created_at).getTime();

const comparators: Record<SortKey, (a: Entry, b: Entry) => number> = {
  latest: (a, b) => time(b) - time(a),
  oldest: (a, b) => time(a) - time(b),
  "amount-desc": (a, b) => b.amount - a.amount || time(b) - time(a),
  "amount-asc": (a, b) => a.amount - b.amount || time(b) - time(a),
  name: (a, b) => a.guest_name.localeCompare(b.guest_name, "ko"),
};

export type SideFilter = "all" | Side;

export function useEntryList(entries: Entry[]) {
  const [searchQuery, setSearchQueryState] = useState("");
  const [sortKey, setSortKeyState] = useState<SortKey>("latest");
  const [sideFilter, setSideFilterState] = useState<SideFilter>("all");
  const [page, setPage] = useState(1);

  const sideCounts = useMemo(
    () => ({
      all: entries.length,
      groom: entries.filter((entry) => entry.side === "groom").length,
      bride: entries.filter((entry) => entry.side === "bride").length,
    }),
    [entries],
  );

  const filteredEntries = useMemo(() => {
    const bySide =
      sideFilter === "all" ? entries : entries.filter((entry) => entry.side === sideFilter);
    const filtered = searchQuery.trim()
      ? bySide.filter(
          (entry) =>
            matchesKorean(entry.guest_name, searchQuery) ||
            (entry.memo ? matchesKorean(entry.memo, searchQuery) : false) ||
            (entry.relation ? RELATION_LABELS[entry.relation].includes(searchQuery.trim()) : false) ||
            (/^[\d,]+$/.test(searchQuery.trim()) &&
              String(entry.amount).startsWith(searchQuery.replace(/,/g, "").trim())),
        )
      : bySide;
    return [...filtered].sort(comparators[sortKey]);
  }, [entries, searchQuery, sortKey, sideFilter]);

  const filteredTotal = useMemo(
    () => filteredEntries.reduce((sum, entry) => sum + entry.amount, 0),
    [filteredEntries],
  );

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredEntries.slice(start, start + PAGE_SIZE);
  }, [filteredEntries, currentPage]);

  return {
    searchQuery,
    sortKey,
    sideFilter,
    sideCounts,
    setSideFilter: (value: SideFilter) => {
      setSideFilterState(value);
      setPage(1);
    },
    filteredEntries,
    filteredTotal,
    paginatedEntries,
    currentPage,
    totalPages,
    pageSize: PAGE_SIZE,
    setSearchQuery: (value: string) => {
      setSearchQueryState(value);
      setPage(1);
    },
    setSortKey: (value: SortKey) => {
      setSortKeyState(value);
      setPage(1);
    },
    setCurrentPage: setPage,
    /** 특정 항목이 보이는 페이지로 이동 */
    revealEntry: (id: string) => {
      const index = filteredEntries.findIndex((entry) => entry.id === id);
      if (index >= 0) setPage(Math.floor(index / PAGE_SIZE) + 1);
    },
  };
}
