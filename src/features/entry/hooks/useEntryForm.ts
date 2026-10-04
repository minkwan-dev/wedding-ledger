"use client";

import { useCallback, useState } from "react";

import { AMOUNT_PRESETS } from "@/shared/lib/constants";
import { createEntrySchema } from "@/shared/lib/schemas/entry";

type UseEntryFormOptions = {
  onSuccess: (guestName: string, amount: number) => Promise<void>;
};

type UseEntryFormResult = {
  guestName: string;
  amount: string;
  memo: string;
  isSubmitting: boolean;
  error: string | null;
  presets: typeof AMOUNT_PRESETS;
  setGuestName: (value: string) => void;
  setAmount: (value: string) => void;
  setMemo: (value: string) => void;
  selectPreset: (value: number) => void;
  requestConfirm: () => boolean;
  confirmSubmit: () => Promise<boolean>;
  reset: () => void;
};

export function useEntryForm({ onSuccess }: UseEntryFormOptions): UseEntryFormResult {
  const [guestName, setGuestName] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setGuestName("");
    setAmount("");
    setMemo("");
    setError(null);
  }, []);

  const selectPreset = useCallback((value: number) => {
    setAmount(String(value));
    setError(null);
  }, []);

  const validate = useCallback(() => {
    const parsed = createEntrySchema.safeParse({
      guest_name: guestName,
      amount: Number(amount),
      memo: memo.trim() ? memo : null,
    });

    if (!parsed.success) {
      return parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.";
    }

    return null;
  }, [amount, guestName, memo]);

  const requestConfirm = useCallback(() => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return false;
    }

    setError(null);
    return true;
  }, [validate]);

  const confirmSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_name: guestName.trim(),
          amount: Number(amount),
          memo: memo.trim() ? memo : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "저장에 실패했습니다.");
      }

      const savedName = guestName.trim();
      const savedAmount = Number(amount);
      reset();
      await onSuccess(savedName, savedAmount);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [amount, guestName, memo, onSuccess, reset]);

  return {
    guestName,
    amount,
    memo,
    isSubmitting,
    error,
    presets: AMOUNT_PRESETS,
    setGuestName,
    setAmount,
    setMemo,
    selectPreset,
    requestConfirm,
    confirmSubmit,
    reset,
  };
}
