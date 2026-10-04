"use client";

import { useMemo, useState } from "react";

import type { Entry } from "@/shared/lib/schemas/entry";

type UseEntryListResult = {
  searchQuery: string;
  filteredEntries: Entry[];
  setSearchQuery: (value: string) => void;
};

export function useEntryList(entries: Entry[]): UseEntryListResult {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return entries;

    return entries.filter((entry) =>
      entry.guest_name.toLowerCase().includes(query),
    );
  }, [entries, searchQuery]);

  return { searchQuery, filteredEntries, setSearchQuery };
}
