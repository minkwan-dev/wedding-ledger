"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "wedding-ledger:amount-masked";
const EVENT = "wedding-ledger:mask-change";

function read(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** 금액 가리기 상태. 여러 컴포넌트가 같은 값을 공유한다. */
export function useAmountMask() {
  const isMasked = useSyncExternalStore(subscribe, read, () => true);

  const toggleMask = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(!read()));
    } catch {
      // 무시
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { isMasked, toggleMask };
}
