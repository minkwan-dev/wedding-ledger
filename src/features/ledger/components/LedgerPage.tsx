"use client";

import { Download, Loader2, Moon, Sun } from "lucide-react";

import { EntryForm } from "@/features/entry/components/EntryForm";
import { EntryTable } from "@/features/ledger/components/EntryTable";
import { LedgerStatsBar } from "@/features/ledger/components/LedgerStatsBar";
import { useLedgerPage } from "@/features/ledger/hooks/useLedgerPage";
import { AppShell } from "@/shared/components/AppShell";
import { Logo } from "@/shared/components/Logo";
import { Button } from "@/shared/components/ui/button";
import { useTheme } from "@/shared/hooks/useTheme";

export function LedgerPage() {
  const {
    entries,
    isLoading,
    error,
    refetch,
    excel,
    highlightId,
    handleCreated,
    handleUpdated,
    deleteEntry,
  } = useLedgerPage();
  const { theme, toggleTheme } = useTheme();

  return (
    <AppShell>
      <header className="mb-8 flex items-center justify-between gap-4 sm:mb-10">
        <h1 aria-label="Wedding Ledger">
          <Logo />
        </h1>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-10 rounded-xl text-muted-foreground"
            aria-label={theme === "dark" ? "밝은 화면으로" : "어두운 화면으로"}
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-2 rounded-xl px-3.5"
            disabled={excel.isExporting || entries.length === 0}
            onClick={() => void excel.exportExcel()}
          >
            {excel.isExporting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            <span className="hidden sm:inline">엑셀 내보내기</span>
            <span className="sm:hidden">엑셀</span>
          </Button>
        </div>
      </header>

      <LedgerStatsBar entries={entries} isLoading={isLoading} />

      <div className="mt-6 grid items-start gap-6 lg:mt-8 lg:grid-cols-[420px_1fr] lg:gap-8">
        <section
          aria-labelledby="entry-form-title"
          className="rounded-[28px] border bg-card p-6 sm:p-7 lg:sticky lg:top-6"
        >
          <h2 id="entry-form-title" className="mb-6 text-lg font-bold tracking-tight">
            축의금 입력
          </h2>
          <EntryForm entries={entries} onCreated={handleCreated} />
        </section>

        <EntryTable
          entries={entries}
          isLoading={isLoading}
          error={error}
          highlightId={highlightId}
          onRetry={refetch}
          onUpdated={handleUpdated}
          onDelete={(entry) => void deleteEntry(entry)}
        />
      </div>
    </AppShell>
  );
}
