"use client";

import { useCallback, useEffect, useState } from "react";

import type { Entry } from "@/shared/lib/schemas/entry";

type UseEntryEditOptions = {
  onSuccess: () => Promise<void>;
};

type UseEntryEditResult = {
  editingEntry: Entry | null;
  guestName: string;
  amount: string;
  memo: string;
  isSubmitting: boolean;
  error: string | null;
  openEdit: (entry: Entry) => void;
  closeEdit: () => void;
  setGuestName: (value: string) => void;
  setAmount: (value: string) => void;
  setMemo: (value: string) => void;
  save: () => Promise<boolean>;
  remove: (entry: Entry) => Promise<boolean>;
};

export function useEntryEdit({ onSuccess }: UseEntryEditOptions): UseEntryEditResult {
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [guestName, setGuestName] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editingEntry) return;
    setGuestName(editingEntry.guest_name);
    setAmount(String(editingEntry.amount));
    setMemo(editingEntry.memo ?? "");
    setError(null);
  }, [editingEntry]);

  const closeEdit = useCallback(() => {
    setEditingEntry(null);
    setError(null);
  }, []);

  const openEdit = useCallback((entry: Entry) => {
    setEditingEntry(entry);
  }, []);

  const save = useCallback(async () => {
    if (!editingEntry) return false;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/entries/${editingEntry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_name: guestName,
          amount: Number(amount),
          memo: memo.trim() ? memo : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "수정에 실패했습니다.");
      }

      closeEdit();
      await onSuccess();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "수정에 실패했습니다.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [amount, closeEdit, editingEntry, guestName, memo, onSuccess]);

  const remove = useCallback(
    async (entry: Entry) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await fetch(`/api/entries/${entry.id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "삭제에 실패했습니다.");
        }

        if (editingEntry?.id === entry.id) {
          closeEdit();
        }

        await onSuccess();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "삭제에 실패했습니다.");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [closeEdit, editingEntry?.id, onSuccess],
  );

  return {
    editingEntry,
    guestName,
    amount,
    memo,
    isSubmitting,
    error,
    openEdit,
    closeEdit,
    setGuestName,
    setAmount,
    setMemo,
    save,
    remove,
  };
}
