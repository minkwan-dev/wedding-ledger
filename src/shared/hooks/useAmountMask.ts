"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "wedding-ledger:amount-masked";

export function useAmountMask() {
  const [isMasked, setIsMasked] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setIsMasked(stored === "true");
    }
  }, []);

  const toggleMask = useCallback(() => {
    setIsMasked((prev) => {
      const next = !prev;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { isMasked, toggleMask };
}
