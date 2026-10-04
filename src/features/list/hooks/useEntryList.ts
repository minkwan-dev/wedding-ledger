"use client";

import { useEffect, useMemo, useState } from "react";

import type { Entry } from "@/shared/lib/schemas/entry";

const PAGE_SIZE = 5;

type UseEntryListResult = {
  searchQuery: string;
  filteredEntries: Entry[];
  paginatedEntries: Entry[];
  currentPage: number;
  totalPages: number;
  setSearchQuery: (value: string) => void;
  setCurrentPage: (page: number) => void;
};

export function useEntryList(entries: Entry[]): UseEntryListResult {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return entries;

    return entries.filter((entry) =>
      entry.guest_name.toLowerCase().includes(query),
    );
  }, [entries, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));

  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredEntries.slice(start, start + PAGE_SIZE);
  }, [filteredEntries, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return {
    searchQuery,
    filteredEntries,
    paginatedEntries,
    currentPage,
    totalPages,
    setSearchQuery,
    setCurrentPage,
  };
}
