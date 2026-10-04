"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

type EntryEditDialogProps = {
  open: boolean;
  guestName: string;
  amount: string;
  memo: string;
  isSubmitting: boolean;
  error: string | null;
  onGuestNameChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onMemoChange: (value: string) => void;
  onClose: () => void;
  onSave: () => Promise<void>;
};

export function EntryEditDialog({
  open,
  guestName,
  amount,
  memo,
  isSubmitting,
  error,
  onGuestNameChange,
  onAmountChange,
  onMemoChange,
  onClose,
  onSave,
}: EntryEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">축의금 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-guest-name">성함</Label>
            <Input
              id="edit-guest-name"
              value={guestName}
              onChange={(event) => onGuestNameChange(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-amount">금액</Label>
            <Input
              id="edit-amount"
              inputMode="numeric"
              value={amount}
              onChange={(event) =>
                onAmountChange(event.target.value.replace(/[^\d]/g, ""))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-memo">메모</Label>
            <Textarea
              id="edit-memo"
              value={memo}
              onChange={(event) => onMemoChange(event.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button type="button" onClick={() => void onSave()} disabled={isSubmitting}>
            {isSubmitting ? "저장 중..." : "저장"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
