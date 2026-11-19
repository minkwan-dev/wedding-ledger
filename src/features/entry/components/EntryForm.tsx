"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { Info } from "lucide-react";

import { EntrySaveConfirmDialog } from "@/features/entry/components/EntrySaveConfirmDialog";
import { useEntryForm } from "@/features/entry/hooks/useEntryForm";
import { AmountField } from "@/shared/components/AmountField";
import { RelationPicker, SidePicker } from "@/shared/components/GuestMeta";
import { Kbd } from "@/shared/components/Kbd";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { useHotkey } from "@/shared/hooks/useHotkey";
import { SIDE_LABELS } from "@/shared/lib/constants";
import { formatCurrency } from "@/shared/lib/format";
import type { Entry } from "@/shared/lib/schemas/entry";

type EntryFormProps = {
  entries: Entry[];
  onCreated: (entry: Entry) => void;
};

export const fieldClass =
  "rounded-xl border-border bg-card focus-visible:border-brand/60 focus-visible:ring-4 focus-visible:ring-brand/10";

export function EntryForm({ entries, onCreated }: EntryFormProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const form = useEntryForm({ onSuccess: onCreated });

  useHotkey("n", () => nameRef.current?.focus());

  const duplicates = useMemo(() => {
    const name = form.guestName.trim();
    if (!name) return [];
    return entries.filter((entry) => entry.guest_name.trim() === name);
  }, [entries, form.guestName]);

  const handleSubmit = () => {
    const errors = form.requestConfirm();
    if (errors) {
      if (errors.guest_name) nameRef.current?.focus();
      else if (errors.amount) amountRef.current?.focus();
      return;
    }
    setShowConfirm(true);
  };

  return (
    <>
      <form
        className="space-y-7"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <SidePicker value={form.side} onChange={form.setSide} error={form.fieldErrors.side} />

        <Field label="성함" htmlFor="guest-name" aside={<Kbd className="hidden lg:inline-flex">N</Kbd>}>
          <Input
            ref={nameRef}
            id="guest-name"
            value={form.guestName}
            onChange={(event) => form.setGuestName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                event.preventDefault();
                amountRef.current?.focus();
              }
            }}
            placeholder="하객 성함"
            autoComplete="off"
            enterKeyHint="next"
            aria-invalid={Boolean(form.fieldErrors.guest_name)}
            className={`h-12 px-4 text-base ${fieldClass}`}
          />
          {form.fieldErrors.guest_name ? (
            <p className="text-[13px] text-destructive">{form.fieldErrors.guest_name}</p>
          ) : duplicates.length > 0 ? (
            <p className="flex items-start gap-1.5 rounded-xl bg-brand-soft px-3 py-2 text-[13px] text-foreground/80 animate-in fade-in slide-in-from-top-1">
              <Info className="mt-0.5 size-3.5 shrink-0 text-brand" />
              <span>
                같은 성함이 이미 {duplicates.length}건 있어요 ·{" "}
                <span className="num">
                  {duplicates
                    .slice(0, 3)
                    .map(
                      (entry) =>
                        `${entry.side ? SIDE_LABELS[entry.side] + " " : ""}${formatCurrency(entry.amount)}`,
                    )
                    .join(", ")}
                  {duplicates.length > 3 ? " 외" : ""}
                </span>
              </span>
            </p>
          ) : null}
        </Field>

        <Field label="관계" optional>
          <RelationPicker value={form.relation} onChange={form.setRelation} />
        </Field>

        <Field label="금액" htmlFor="amount">
          <AmountField
            id="amount"
            inputRef={amountRef}
            value={form.amount}
            onChange={form.setAmount}
            onAddStep={form.addStep}
            error={form.fieldErrors.amount}
            size="lg"
          />
        </Field>

        <Field
          label="메모"
          htmlFor="memo"
          optional
          aside={<span className="num text-xs text-muted-foreground/70">{form.memo.length}/200</span>}
        >
          <Textarea
            id="memo"
            value={form.memo}
            maxLength={200}
            onChange={(event) => form.setMemo(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="동행, 대리 전달 등"
            rows={2}
            className={`min-h-16 resize-none px-4 py-3 ${fieldClass}`}
          />
        </Field>

        {form.error ? (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {form.error}
          </p>
        ) : null}

        <Button
          type="submit"
          className="h-12 w-full rounded-xl text-[15px] font-medium tracking-wide"
          disabled={form.isSubmitting}
        >
          저장하기
        </Button>
      </form>

      <EntrySaveConfirmDialog
        open={showConfirm}
        guestName={form.guestName.trim()}
        amount={Number(form.amount) || 0}
        memo={form.memo}
        side={form.side}
        relation={form.relation}
        duplicateCount={duplicates.length}
        isSubmitting={form.isSubmitting}
        error={form.error}
        finalFocus={nameRef}
        onClose={() => setShowConfirm(false)}
        onConfirm={async () => {
          const success = await form.confirmSubmit();
          if (success) setShowConfirm(false);
        }}
      />
    </>
  );
}

export function Field({
  label,
  htmlFor,
  optional,
  aside,
  children,
}: {
  label: string;
  htmlFor?: string;
  optional?: boolean;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-muted-foreground">
          {label}
          {optional ? <span className="ml-1 font-normal text-muted-foreground/60">선택</span> : null}
        </label>
        {aside}
      </div>
      {children}
    </div>
  );
}
