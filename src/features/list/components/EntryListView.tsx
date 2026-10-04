"use client";

import { EntryEditDialog } from "@/features/list/components/EntryEditDialog";
import { useEntryEdit } from "@/features/list/hooks/useEntryEdit";
import { useEntryList } from "@/features/list/hooks/useEntryList";
import { useExcelExport } from "@/features/list/hooks/useExcelExport";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import { formatCurrency, formatDateTime } from "@/shared/lib/format";
import type { Entry } from "@/shared/lib/schemas/entry";

type EntryListViewProps = {
  entries: Entry[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
};

export function EntryListView({
  entries,
  isLoading,
  error,
  onRefresh,
}: EntryListViewProps) {
  const { searchQuery, filteredEntries, setSearchQuery } = useEntryList(entries);
  const edit = useEntryEdit({ onSuccess: onRefresh });
  const excel = useExcelExport();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">불러오는 중...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="이름 검색"
          className="h-11"
        />
        <Button
          type="button"
          variant="outline"
          className="h-11 shrink-0"
          disabled={excel.isExporting}
          onClick={() => void excel.exportExcel()}
        >
          {excel.isExporting ? "내보내는 중..." : "엑셀 내보내기"}
        </Button>
      </div>

      {excel.error ? <p className="text-sm text-destructive">{excel.error}</p> : null}

      {filteredEntries.length === 0 ? (
        <p className="text-sm text-muted-foreground">표시할 항목이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {filteredEntries.map((entry, index) => (
            <li key={entry.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <p className="truncate font-medium">{entry.guest_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(entry.amount)}
                  </p>
                  {entry.memo ? (
                    <p className="text-sm text-muted-foreground">{entry.memo}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(entry.created_at)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => edit.openEdit(entry)}
                  >
                    수정
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={edit.isSubmitting}
                    onClick={() => {
                      if (window.confirm(`${entry.guest_name} 항목을 삭제할까요?`)) {
                        void edit.remove(entry);
                      }
                    }}
                  >
                    삭제
                  </Button>
                </div>
              </div>
              {index < filteredEntries.length - 1 ? <Separator className="mt-4" /> : null}
            </li>
          ))}
        </ul>
      )}

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
          await edit.save();
        }}
      />
    </div>
  );
}
