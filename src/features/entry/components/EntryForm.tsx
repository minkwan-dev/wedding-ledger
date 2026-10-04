"use client";

import { useEntryForm } from "@/features/entry/hooks/useEntryForm";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { formatCurrency } from "@/shared/lib/format";

type EntryFormProps = {
  onSuccess: () => Promise<void>;
};

export function EntryForm({ onSuccess }: EntryFormProps) {
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
    submit,
  } = useEntryForm({ onSuccess });

  return (
    <form
      className="space-y-8"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="guest-name">이름</Label>
        <Input
          id="guest-name"
          value={guestName}
          onChange={(event) => setGuestName(event.target.value)}
          placeholder="하객 이름"
          autoComplete="off"
          className="h-12 text-base"
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
          className="h-12 text-base"
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
          placeholder="동행, 대리 전달 등 (선택)"
          rows={3}
          className="resize-none text-base"
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={isSubmitting}>
        {isSubmitting ? "저장 중..." : "저장하기"}
      </Button>
    </form>
  );
}
