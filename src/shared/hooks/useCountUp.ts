"use client";

import { useEffect, useRef, useState } from "react";

/** 숫자가 바뀔 때 이전 값에서 새 값으로 부드럽게 올라가는 값을 돌려준다. */
export function useCountUp(target: number, duration = 700): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      fromRef.current = target;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 모션 축소 시 즉시 반영
      setValue(target);
      return;
    }

    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      const next = Math.round(from + (target - from) * eased);
      fromRef.current = next;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
