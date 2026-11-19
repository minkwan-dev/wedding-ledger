"use client";

import { useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { useEntryEdit } from "@/features/list/hooks/useEntryEdit";
import { AmountField } from "@/shared/components/AmountField";
import {
  GuestAvatar,
  RelationPicker,
  RelationTag,
  SideLabel,
  SidePicker,
} from "@/shared/components/GuestMeta";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { Textarea } from "@/shared/components/ui/textarea";
import { formatDateTime, formatKoreanAmount, formatNumber } from "@/shared/lib/format";
import type { Entry } from "@/shared/lib/schemas/entry";

type EntryDetailSheetProps = {
  entry: Entry | null;
  open: boolean;
  onClose: () => void;
  onUpdated: (entry: Entry) => void;
  onDelete: (entry: Entry) => void;
};

export function EntryDetailSheet({
  entry,
  open,
  onClose,
  onUpdated,
  onDelete,
}: EntryDetailSheetProps) {
  const edit = useEntryEdit({ onSuccess: onUpdated });
  const isEditing = Boolean(edit.editingEntry);
  const { closeEdit } = edit;

  useEffect(() => {
    if (!open) closeEdit();
  }, [open, closeEdit]);

  if (!entry) return null;

  const wasEdited = entry.updated_at && entry.updated_at !== entry.created_at &&
    new Date(entry.updated_at).getTime() - new Date(entry.created_at).getTime() > 1000;

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <SheetContent side="right" className="w-full gap-0 bg-card sm:max-w-md">
        {isEditing ? (
          <form
            className="flex h-full flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              void edit.save();
            }}
          >
            <SheetHeader className="border-b px-6 pt-6 pb-4">
              <SheetTitle className="text-lg font-bold">정보 수정</SheetTitle>
              <SheetDescription>{entry.guest_name}님 항목을 수정해요</SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              <SidePicker value={edit.side} onChange={edit.setSide} />
              <div className="space-y-2">
                <Label htmlFor="edit-guest-name" className="text-[13px] text-muted-foreground">
                  성함
                </Label>
                <Input
                  id="edit-guest-name"
                  value={edit.guestName}
                  autoFocus
                  autoComplete="off"
                  onChange={(event) => edit.setGuestName(event.target.value)}
                  className="h-11 rounded-xl px-4 text-base focus-visible:border-brand/60 focus-visible:ring-4 focus-visible:ring-brand/12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] text-muted-foreground">관계</Label>
                <RelationPicker value={edit.relation} onChange={edit.setRelation} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-amount" className="text-[13px] text-muted-foreground">
                  금액
                </Label>
                <AmountField
                  id="edit-amount"
                  value={edit.amount}
                  onChange={edit.setAmount}
                  onAddStep={edit.addStep}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-memo" className="text-[13px] text-muted-foreground">
                  메모
                </Label>
                <Textarea
                  id="edit-memo"
                  value={edit.memo}
                  maxLength={200}
                  onChange={(event) => edit.setMemo(event.target.value)}
                  rows={3}
                  className="resize-none rounded-xl px-4 py-3 focus-visible:border-brand/60 focus-visible:ring-4 focus-visible:ring-brand/12"
                />
              </div>
              {edit.error ? (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {edit.error}
                </p>
              ) : null}
            </div>

            <SheetFooter className="grid grid-cols-2 gap-2 border-t px-6 py-4">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl"
                onClick={edit.closeEdit}
                disabled={edit.isSubmitting}
              >
                취소
              </Button>
              <Button
                type="submit"
                className="h-11 rounded-xl font-semibold"
                disabled={edit.isSubmitting || !edit.isDirty}
              >
                {edit.isSubmitting ? "저장 중…" : "변경사항 저장"}
              </Button>
            </SheetFooter>
          </form>
        ) : (
          <>
            <SheetHeader className="items-start gap-4 px-6 pt-8 pb-6">
              <GuestAvatar name={entry.guest_name} side={entry.side} size="lg" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <SideLabel side={entry.side} />
                  <RelationTag relation={entry.relation} />
                </div>
                <SheetTitle className="text-2xl font-bold">
                  {entry.guest_name}
                </SheetTitle>
                <SheetDescription className="sr-only">축의금 상세</SheetDescription>
              </div>
              <div>
                <p className="display-num text-[2.75rem] leading-none">
                  {formatNumber(entry.amount)}
                  <span className="ml-1 text-xl font-semibold tracking-normal text-muted-foreground">원</span>
                </p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  {formatKoreanAmount(entry.amount)}
                </p>
              </div>
            </SheetHeader>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-6">
              <section className="rounded-2xl bg-surface p-4">
                <h3 className="mb-1.5 text-xs font-medium text-muted-foreground">메모</h3>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {entry.memo?.trim() ? (
                    entry.memo
                  ) : (
                    <span className="text-muted-foreground/70">메모가 없어요</span>
                  )}
                </p>
              </section>

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">입력</dt>
                  <dd className="num">{formatDateTime(entry.created_at)}</dd>
                </div>
                {wasEdited ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">마지막 수정</dt>
                    <dd className="num">{formatDateTime(entry.updated_at)}</dd>
                  </div>
                ) : null}
              </dl>
            </div>

            <SheetFooter className="grid grid-cols-[auto_1fr] gap-2 border-t px-6 py-4">
              <Button
                type="button"
                variant="destructive"
                className="h-11 gap-1.5 rounded-xl px-4"
                onClick={() => onDelete(entry)}
              >
                <Trash2 className="size-4" />
                삭제
              </Button>
              <Button
                type="button"
                className="h-11 gap-1.5 rounded-xl font-semibold"
                onClick={() => edit.openEdit(entry)}
              >
                <Pencil className="size-4" />
                수정하기
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
