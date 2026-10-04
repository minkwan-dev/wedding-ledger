"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { formatCurrency } from "@/shared/lib/format";

type EntrySaveConfirmDialogProps = {
  open: boolean;
  guestName: string;
  amount: number;
  memo: string;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export function EntrySaveConfirmDialog({
  open,
  guestName,
  amount,
  memo,
  isSubmitting,
  onClose,
  onConfirm,
}: EntrySaveConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">저장 확인</DialogTitle>
          <DialogDescription>아래 내용으로 저장할까요?</DialogDescription>
        </DialogHeader>

        <dl className="space-y-3 py-2 text-sm">
          <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
            <dt className="text-muted-foreground">성함</dt>
            <dd className="font-medium">{guestName}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
            <dt className="text-muted-foreground">금액</dt>
            <dd className="font-medium">{formatCurrency(amount)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="shrink-0 text-muted-foreground">메모</dt>
            <dd className="text-right text-muted-foreground">
              {memo.trim() ? memo : "—"}
            </dd>
          </div>
        </dl>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button type="button" onClick={() => void onConfirm()} disabled={isSubmitting}>
            {isSubmitting ? "저장 중..." : "저장"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
