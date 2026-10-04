import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="mx-auto min-h-full w-full max-w-[1200px] px-6 py-10 lg:px-10 lg:py-12">
      {children}
    </div>
  );
}
