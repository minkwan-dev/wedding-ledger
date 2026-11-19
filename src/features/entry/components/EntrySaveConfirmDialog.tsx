"use client";

import { useRef, type RefObject } from "react";
import { AlertTriangle } from "lucide-react";

import { RelationTag, SideLabel } from "@/shared/components/GuestMeta";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { formatKoreanAmount, formatNumber } from "@/shared/lib/format";
import type { Relation, Side } from "@/shared/lib/schemas/entry";

type EntrySaveConfirmDialogProps = {
  open: boolean;
  guestName: string;
  amount: number;
  memo: string;
  side: Side | null;
  relation: Relation | null;
  duplicateCount: number;
  isSubmitting: boolean;
  error: string | null;
  finalFocus?: RefObject<HTMLElement | null>;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export function EntrySaveConfirmDialog({
  open,
  guestName,
  amount,
  memo,
  side,
  relation,
  duplicateCount,
  isSubmitting,
  error,
  finalFocus,
  onClose,
  onConfirm,
}: EntrySaveConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent
        className="max-w-md gap-0 overflow-hidden rounded-3xl bg-card p-0 ring-border sm:max-w-sm"
        showCloseButton={false}
        initialFocus={confirmRef}
        finalFocus={finalFocus}
        onKeyDown={(event) => {
          // 열리는 애니메이션 중 포커스가 버튼에 닿기 전에 눌린 Enter도 저장으로 처리한다.
          const target = event.target as HTMLElement;
          if (event.key !== "Enter" || target.tagName === "BUTTON" || isSubmitting) return;
          event.preventDefault();
          void onConfirm();
        }}
      >
        <DialogHeader className="items-center gap-2 px-6 pt-8 pb-2 text-center">
          <DialogDescription className="text-[13px]">이대로 저장할까요?</DialogDescription>
          <div className="flex items-center gap-2">
            <SideLabel side={side} />
            <RelationTag relation={relation} />
          </div>
          <DialogTitle className="text-xl font-bold">{guestName}님</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-7 text-center">
          <p className="display-num text-[2.75rem] leading-none">
            {formatNumber(amount)}
            <span className="ml-1 text-xl font-semibold tracking-normal text-muted-foreground">원</span>
          </p>
          <p className="mt-2 text-[13px] text-muted-foreground">{formatKoreanAmount(amount)}</p>

          {memo.trim() ? (
            <p className="mt-5 rounded-2xl bg-surface px-4 py-3 text-left text-sm leading-relaxed text-foreground/80">
              {memo}
            </p>
          ) : null}

          {duplicateCount > 0 ? (
            <p className="mt-4 flex items-center justify-center gap-1.5 text-[13px] text-brand">
              <AlertTriangle className="size-3.5" />
              같은 성함이 {duplicateCount}건 더 있어요
            </p>
          ) : null}

          {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
        </div>

        <div className="grid grid-cols-2 gap-2 border-t p-3">
          <Button
            type="button"
            variant="ghost"
            className="h-11 rounded-xl text-[15px]"
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            ref={confirmRef}
            type="button"
            className="h-11 rounded-xl text-[15px] font-medium"
            onClick={() => void onConfirm()}
            disabled={isSubmitting}
          >
            {isSubmitting ? "저장 중…" : "저장"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
