import type { ReactNode } from "react";
import { cn } from "cn";

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-border bg-card px-1.5 text-[11px] font-medium text-muted-foreground shadow-[0_1px_0_var(--border)]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
