"use client";

import { EntryForm } from "@/features/entry/components/EntryForm";
import { PageHeader } from "@/shared/components/PageHeader";
import { useEntries } from "@/shared/hooks/useEntries";

export default function EntryPage() {
  const { refetch } = useEntries();

  return (
    <>
      <PageHeader
        title="축의금 입력"
        description="이름과 금액을 입력하고 저장하세요."
      />
      <EntryForm onSuccess={refetch} />
    </>
  );
}
