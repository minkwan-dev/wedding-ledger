"use client";

import { EntryForm } from "@/features/entry/components/EntryForm";
import { EntryTable } from "@/features/ledger/components/EntryTable";
import { LedgerStatsBar } from "@/features/ledger/components/LedgerStatsBar";
import { useLedgerPage } from "@/features/ledger/hooks/useLedgerPage";
import { AppShell } from "@/shared/components/AppShell";
import { NoticeDialog } from "@/shared/components/NoticeDialog";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function LedgerPage() {
  const {
    entries,
    isLoading,
    error,
    refetch,
    excel,
    notice,
    handleEntrySuccess,
    showNotice,
    closeNotice,
  } = useLedgerPage();

  return (
    <AppShell>
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-3xl font-medium tracking-tight lg:text-4xl">
          축의금 관리
        </h1>
        <Button
          type="button"
          variant="outline"
          disabled={excel.isExporting}
          onClick={() => void excel.exportExcel()}
        >
          {excel.isExporting ? "내보내는 중..." : "엑셀 내보내기"}
        </Button>
      </header>

      {excel.error ? (
        <p className="mb-6 text-sm text-destructive">{excel.error}</p>
      ) : null}

      <LedgerStatsBar entries={entries} />

      <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-10">
        <Card className="h-fit border border-border/80 shadow-none ring-0">
          <CardHeader>
            <CardTitle className="font-heading text-xl">축의금 입력</CardTitle>
          </CardHeader>
          <CardContent>
            <EntryForm onSuccess={handleEntrySuccess} />
          </CardContent>
        </Card>

        <section>
          <h2 className="mb-6 font-heading text-xl font-medium">입력 목록</h2>
          <EntryTable
            entries={entries}
            isLoading={isLoading}
            error={error}
            onRefresh={refetch}
            onNotice={showNotice}
          />
        </section>
      </div>

      <NoticeDialog
        open={Boolean(notice)}
        title={notice?.title ?? ""}
        description={notice?.description ?? ""}
        onClose={closeNotice}
      />
    </AppShell>
  );
}
