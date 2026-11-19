"use client";

import { useEffect, useRef } from "react";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

/** 입력 중이 아닐 때 단일 키(수정키 없이)에 반응하는 단축키. */
export function useHotkey(key: string, handler: (event: KeyboardEvent) => void) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      if (isTypingTarget(event.target)) return;
      if (document.querySelector("[role=dialog][data-open]")) return;
      event.preventDefault();
      handlerRef.current(event);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key]);
}
