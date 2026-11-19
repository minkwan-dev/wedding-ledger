"use client";

import { useCallback, useEffect, useState } from "react";

import { AMOUNT_PRESETS, AMOUNT_STEPS, LAST_SIDE_STORAGE_KEY } from "@/shared/lib/constants";
import {
  createEntrySchema,
  SIDES,
  type Entry,
  type Relation,
  type Side,
} from "@/shared/lib/schemas/entry";

type UseEntryFormOptions = {
  onSuccess: (entry: Entry) => void;
};

type FieldErrors = Partial<Record<"guest_name" | "amount" | "memo" | "side", string>>;

export function useEntryForm({ onSuccess }: UseEntryFormOptions) {
  const [guestName, setGuestNameState] = useState("");
  const [amount, setAmountState] = useState("");
  const [memo, setMemo] = useState("");
  const [side, setSideState] = useState<Side | null>(null);
  const [relation, setRelation] = useState<Relation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // 접수대는 보통 한쪽(신랑측/신부측)을 계속 받으므로 마지막 선택을 기억한다.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LAST_SIDE_STORAGE_KEY);
      if (stored && (SIDES as readonly string[]).includes(stored)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- 저장된 선택 복원
        setSideState(stored as Side);
      }
    } catch {
      // 무시
    }
  }, []);

  const setSide = useCallback((value: Side) => {
    setSideState(value);
    setFieldErrors((prev) => ({ ...prev, side: undefined }));
    try {
      window.localStorage.setItem(LAST_SIDE_STORAGE_KEY, value);
    } catch {
      // 무시
    }
  }, []);

  const reset = useCallback(() => {
    setGuestNameState("");
    setAmountState("");
    setMemo("");
    setRelation(null);
    setError(null);
    setFieldErrors({});
  }, []);

  const setGuestName = useCallback((value: string) => {
    setGuestNameState(value);
    setFieldErrors((prev) => ({ ...prev, guest_name: undefined }));
  }, []);

  const setAmount = useCallback((value: string) => {
    const digits = value.replace(/[^\d]/g, "").replace(/^0+/, "").slice(0, 10);
    setAmountState(digits);
    setFieldErrors((prev) => ({ ...prev, amount: undefined }));
  }, []);

  const addStep = useCallback((value: number) => {
    setAmountState((prev) => String((Number(prev) || 0) + value));
    setFieldErrors((prev) => ({ ...prev, amount: undefined }));
  }, []);

  const payload = () => ({
    guest_name: guestName.trim(),
    amount: Number(amount),
    memo: memo.trim() ? memo : null,
    side,
    relation,
  });

  const requestConfirm = () => {
    const parsed = createEntrySchema.safeParse(payload());

    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!next[key]) {
          next[key] = key === "amount" && !amount ? "금액을 입력해 주세요." : issue.message;
        }
      }
      setFieldErrors(next);
      return next;
    }

    setFieldErrors({});
    setError(null);
    return null;
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "저장에 실패했습니다.");
      }

      reset();
      onSuccess(data as Entry);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    guestName,
    amount,
    memo,
    side,
    relation,
    isSubmitting,
    error,
    fieldErrors,
    presets: AMOUNT_PRESETS,
    steps: AMOUNT_STEPS,
    setGuestName,
    setAmount,
    setMemo,
    setSide,
    setRelation,
    addStep,
    requestConfirm,
    confirmSubmit,
    reset,
  };
}
