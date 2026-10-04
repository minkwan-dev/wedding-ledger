"use client";

import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { formatCurrency, formatDateTime } from "@/shared/lib/format";
import type { Entry } from "@/shared/lib/schemas/entry";

type EntryDetailSheetProps = {
  entry: Entry | null;
  open: boolean;
  onClose: () => void;
  onEdit: (entry: Entry) => void;
  onDelete: (entry: Entry) => void;
};

export function EntryDetailSheet({
  entry,
  open,
  onClose,
  onEdit,
  onDelete,
}: EntryDetailSheetProps) {
  if (!entry) return null;

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="border-b border-border/60 pb-4">
          <SheetTitle className="text-xl">{entry.guest_name}</SheetTitle>
          <SheetDescription>{formatCurrency(entry.amount)}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 px-4 py-2">
          <section className="space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground">메모</h3>
            <p className="text-sm leading-relaxed">
              {entry.memo?.trim() ? entry.memo : "메모 없음"}
            </p>
          </section>

          <Separator />

          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">입력일시</dt>
              <dd>{formatDateTime(entry.created_at)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">수정일시</dt>
              <dd>{formatDateTime(entry.updated_at)}</dd>
            </div>
          </dl>
        </div>

        <SheetFooter className="border-t border-border/60 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              onClose();
              onEdit(entry);
            }}
          >
            수정
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={() => {
              onClose();
              onDelete(entry);
            }}
          >
            삭제
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
