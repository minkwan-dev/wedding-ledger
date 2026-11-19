"use client";

import { useCallback, useState } from "react";

import {
  updateEntrySchema,
  type Entry,
  type Relation,
  type Side,
} from "@/shared/lib/schemas/entry";

type UseEntryEditOptions = {
  onSuccess: (entry: Entry) => void;
};

export function useEntryEdit({ onSuccess }: UseEntryEditOptions) {
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [guestName, setGuestName] = useState("");
  const [amount, setAmountState] = useState("");
  const [memo, setMemo] = useState("");
  const [side, setSide] = useState<Side | null>(null);
  const [relation, setRelation] = useState<Relation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openEdit = useCallback((entry: Entry) => {
    setEditingEntry(entry);
    setGuestName(entry.guest_name);
    setAmountState(String(entry.amount));
    setMemo(entry.memo ?? "");
    setSide(entry.side);
    setRelation(entry.relation);
    setError(null);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingEntry(null);
    setError(null);
  }, []);

  const setAmount = useCallback((value: string) => {
    setAmountState(value.replace(/[^\d]/g, "").replace(/^0+/, "").slice(0, 10));
  }, []);

  const addStep = useCallback(
    (value: number) => setAmountState((prev) => String((Number(prev) || 0) + value)),
    [],
  );

  const isDirty =
    editingEntry !== null &&
    (guestName.trim() !== editingEntry.guest_name ||
      Number(amount) !== editingEntry.amount ||
      (memo.trim() || null) !== (editingEntry.memo?.trim() || null) ||
      side !== editingEntry.side ||
      relation !== editingEntry.relation);

  const save = useCallback(async () => {
    if (!editingEntry) return false;

    const payload = {
      guest_name: guestName,
      amount: Number(amount),
      memo: memo.trim() ? memo : null,
      side,
      relation,
    };
    const parsed = updateEntrySchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.");
      return false;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/entries/${editingEntry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "수정에 실패했습니다.");
      }

      closeEdit();
      onSuccess(data as Entry);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "수정에 실패했습니다.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [amount, closeEdit, editingEntry, guestName, memo, onSuccess, relation, side]);

  return {
    editingEntry,
    guestName,
    amount,
    memo,
    side,
    relation,
    setSide,
    setRelation,
    isSubmitting,
    isDirty,
    error,
    openEdit,
    closeEdit,
    setGuestName,
    setAmount,
    addStep,
    setMemo,
    save,
  };
}
