"use client";

import { useCallback, useSyncExternalStore } from "react";

import { THEME_STORAGE_KEY } from "@/shared/lib/constants";

type Theme = "light" | "dark";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function useTheme() {
  const theme = useSyncExternalStore<Theme>(subscribe, getSnapshot, () => "light");

  const toggleTheme = useCallback(() => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // 저장소를 쓸 수 없는 환경에서도 테마 전환은 유지한다.
    }
  }, []);

  return { theme, toggleTheme };
}
