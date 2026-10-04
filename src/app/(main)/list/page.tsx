"use client";

import { EntryListView } from "@/features/list/components/EntryListView";
import { PageHeader } from "@/shared/components/PageHeader";
import { useEntries } from "@/shared/hooks/useEntries";

export default function ListPage() {
  const { entries, isLoading, error, refetch } = useEntries();

  return (
    <>
      <PageHeader
        title="목록"
        description="입력된 축의금을 검색하고 수정할 수 있습니다."
      />
      <EntryListView
        entries={entries}
        isLoading={isLoading}
        error={error}
        onRefresh={refetch}
      />
    </>
  );
}
