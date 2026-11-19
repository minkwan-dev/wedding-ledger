import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="mx-auto min-h-full w-full max-w-[1160px] px-4 pt-8 pb-24 sm:px-6 lg:px-10 lg:pt-12">
      {children}
    </div>
  );
}
