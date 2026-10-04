"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

import { EntryDetailSheet } from "@/features/ledger/components/EntryDetailSheet";
import { EntryEditDialog } from "@/features/list/components/EntryEditDialog";
import { useEntryEdit } from "@/features/list/hooks/useEntryEdit";
import { useEntryList } from "@/features/list/hooks/useEntryList";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { formatCurrency, formatDateTime } from "@/shared/lib/format";
import type { Entry } from "@/shared/lib/schemas/entry";

type EntryTableProps = {
  entries: Entry[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
  onNotice: (title: string, description: string) => void;
};

export function EntryTable({
  entries,
  isLoading,
  error,
  onRefresh,
  onNotice,
}: EntryTableProps) {
  const { searchQuery, filteredEntries, setSearchQuery } = useEntryList(entries);
  const edit = useEntryEdit({ onSuccess: onRefresh });
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<Entry | null>(null);

  if (isLoading) {
    return <p className="py-12 text-center text-sm text-muted-foreground">불러오는 중...</p>;
  }

  if (error) {
    return <p className="py-12 text-center text-sm text-destructive">{error}</p>;
  }

  return (
    <>
      <div className="mb-6">
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="성함으로 검색"
          className="max-w-xs"
        />
      </div>

      {filteredEntries.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          {searchQuery ? "검색 결과가 없습니다." : "입력된 축의금이 없습니다."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">성함</th>
                <th className="pb-3 pr-4 font-medium">금액</th>
                <th className="pb-3 pr-4 font-medium">입력일시</th>
                <th className="pb-3 text-right font-medium" aria-label="관리" />
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="border-b border-border/50 last:border-0">
                  <td className="py-4 pr-4 font-medium">{entry.guest_name}</td>
                  <td className="py-4 pr-4">{formatCurrency(entry.amount)}</td>
                  <td className="py-4 pr-4 text-muted-foreground">
                    {formatDateTime(entry.created_at)}
                  </td>
                  <td className="py-4 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={`${entry.guest_name} 상세 보기`}
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <MoreHorizontal />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EntryDetailSheet
        entry={selectedEntry}
        open={Boolean(selectedEntry)}
        onClose={() => setSelectedEntry(null)}
        onEdit={edit.openEdit}
        onDelete={setDeletingEntry}
      />

      <EntryEditDialog
        open={Boolean(edit.editingEntry)}
        guestName={edit.guestName}
        amount={edit.amount}
        memo={edit.memo}
        isSubmitting={edit.isSubmitting}
        error={edit.error}
        onGuestNameChange={edit.setGuestName}
        onAmountChange={edit.setAmount}
        onMemoChange={edit.setMemo}
        onClose={edit.closeEdit}
        onSave={async () => {
          const name = edit.guestName;
          const success = await edit.save();
          if (success) {
            onNotice("수정 완료", `${name}님 정보가 수정되었습니다.`);
          }
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingEntry)}
        title="축의금 삭제"
        description={
          deletingEntry
            ? `${deletingEntry.guest_name}님 (${formatCurrency(deletingEntry.amount)}) 항목을 삭제할까요?`
            : ""
        }
        confirmLabel="삭제"
        variant="destructive"
        isSubmitting={edit.isSubmitting}
        onClose={() => setDeletingEntry(null)}
        onConfirm={async () => {
          if (!deletingEntry) return;
          const target = deletingEntry;
          const success = await edit.remove(target);
          if (success) {
            setDeletingEntry(null);
            onNotice(
              "삭제 완료",
              `${target.guest_name}님 (${formatCurrency(target.amount)}) 항목이 삭제되었습니다.`,
            );
          }
        }}
      />
    </>
  );
}
