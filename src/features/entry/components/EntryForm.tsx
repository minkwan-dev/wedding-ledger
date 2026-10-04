"use client";

import { useState } from "react";

import { EntrySaveConfirmDialog } from "@/features/entry/components/EntrySaveConfirmDialog";
import { useEntryForm } from "@/features/entry/hooks/useEntryForm";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { formatCurrency } from "@/shared/lib/format";

type EntryFormProps = {
  onSuccess: (guestName: string, amount: number) => Promise<void>;
};

export function EntryForm({ onSuccess }: EntryFormProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    guestName,
    amount,
    memo,
    isSubmitting,
    error,
    presets,
    setGuestName,
    setAmount,
    setMemo,
    selectPreset,
    requestConfirm,
    confirmSubmit,
  } = useEntryForm({ onSuccess });

  const handleSubmitClick = () => {
    if (!requestConfirm()) return;
    setShowConfirm(true);
  };

  return (
    <>
      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmitClick();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="guest-name">성함</Label>
          <Input
            id="guest-name"
            value={guestName}
            onChange={(event) => setGuestName(event.target.value)}
            placeholder="성함"
            autoComplete="off"
            className="h-10"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="amount">금액</Label>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.value}
                type="button"
                variant={amount === String(preset.value) ? "default" : "outline"}
                className="min-w-16"
                onClick={() => selectPreset(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <Input
            id="amount"
            inputMode="numeric"
            value={amount}
            onChange={(event) => setAmount(event.target.value.replace(/[^\d]/g, ""))}
            placeholder="직접 입력"
            className="h-10"
          />
          {amount ? (
            <p className="text-sm text-muted-foreground">
              {formatCurrency(Number(amount) || 0)}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="memo">메모</Label>
          <Textarea
            id="memo"
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            placeholder="동행, 대리 전달 등"
            rows={3}
            className="resize-none"
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
          저장하기
        </Button>
      </form>

      <EntrySaveConfirmDialog
        open={showConfirm}
        guestName={guestName.trim()}
        amount={Number(amount) || 0}
        memo={memo}
        isSubmitting={isSubmitting}
        onClose={() => setShowConfirm(false)}
        onConfirm={async () => {
          const success = await confirmSubmit();
          if (success) setShowConfirm(false);
        }}
      />
    </>
  );
}
