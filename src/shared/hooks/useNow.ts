"use client";

import { useEffect, useState } from "react";

/** 상대 시간 표시용 현재 시각. interval마다 갱신된다. */
export function useNow(interval = 30_000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), interval);
    return () => window.clearInterval(timer);
  }, [interval]);

  return now;
}
