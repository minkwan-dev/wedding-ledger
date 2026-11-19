"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Gift,
  RotateCw,
  Search,
  X,
} from "lucide-react";
import { cn } from "cn";

import { EntryDetailSheet } from "@/features/ledger/components/EntryDetailSheet";
import { SORT_OPTIONS, useEntryList, type SortKey } from "@/features/list/hooks/useEntryList";
import { GuestAvatar, RelationTag, sideTone } from "@/shared/components/GuestMeta";
import { Kbd } from "@/shared/components/Kbd";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useHotkey } from "@/shared/hooks/useHotkey";
import { useNow } from "@/shared/hooks/useNow";
import { formatDateTime, formatNumber, formatRelative } from "@/shared/lib/format";
import type { Entry } from "@/shared/lib/schemas/entry";

type EntryTableProps = {
  entries: Entry[];
  isLoading: boolean;
  error: string | null;
  highlightId: string | null;
  onRetry: () => Promise<void>;
  onUpdated: (entry: Entry) => void;
  onDelete: (entry: Entry) => void;
};

export function EntryTable({
  entries,
  isLoading,
  error,
  highlightId,
  onRetry,
  onUpdated,
  onDelete,
}: EntryTableProps) {
  const list = useEntryList(entries);
  const now = useNow();
  const searchRef = useRef<HTMLInputElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedEntry = entries.find((entry) => entry.id === selectedId) ?? null;
  const [lastSelected, setLastSelected] = useState<Entry | null>(null);
  if (selectedEntry && selectedEntry !== lastSelected) setLastSelected(selectedEntry);

  useHotkey("/", () => searchRef.current?.focus());

  const { revealEntry } = list;
  const revealRef = useRef(revealEntry);
  useEffect(() => {
    revealRef.current = revealEntry;
  });
  useEffect(() => {
    if (highlightId) revealRef.current(highlightId);
  }, [highlightId]);

  const sortLabel = SORT_OPTIONS.find((option) => option.value === list.sortKey)?.label;
  const isSearching = Boolean(list.searchQuery.trim());
  const rangeStart = (list.currentPage - 1) * list.pageSize + 1;
  const rangeEnd = Math.min(list.currentPage * list.pageSize, list.filteredEntries.length);

  return (
    <section className="flex min-h-full flex-col rounded-[28px] border bg-card">
      <header className="flex flex-wrap items-center gap-3 border-b px-5 pt-6 pb-4 sm:px-7">
        <h2 className="text-lg font-bold tracking-tight">입력 목록</h2>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 rounded-lg px-2.5 text-[13px]" />
              }
            >
              <ArrowDownUp className="size-3.5" />
              {sortLabel}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 rounded-xl p-1.5">
              <DropdownMenuRadioGroup
                value={list.sortKey}
                onValueChange={(value) => list.setSortKey(value as SortKey)}
              >
                {SORT_OPTIONS.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg py-1.5 text-[13px]"
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div role="tablist" aria-label="구분 필터" className="flex w-full gap-5 border-b text-sm">
          {SIDE_FILTERS.map(([key, label]) => {
            const active = list.sideFilter === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => list.setSideFilter(key)}
                className={cn(
                  "relative -mb-px flex items-center gap-1.5 pb-2.5 transition-colors",
                  active
                    ? "font-medium text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {key !== "all" ? (
                  <span className={cn("size-1.5 rounded-full", sideTone[key].bg)} />
                ) : null}
                {label}
                <span className="num text-xs text-muted-foreground">
                  {formatNumber(list.sideCounts[key])}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full pt-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={searchRef}
            type="search"
            value={list.searchQuery}
            onChange={(event) => list.setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                list.setSearchQuery("");
                event.currentTarget.blur();
              }
            }}
            placeholder="이름, 초성(ㄱㅁㅅ), 관계, 메모, 금액으로 검색"
            aria-label="목록 검색"
            className="h-10 w-full rounded-xl bg-muted/70 pr-10 pl-10 text-sm transition-[background-color,box-shadow] outline-none placeholder:text-muted-foreground/80 focus:bg-card focus:ring-2 focus:ring-brand/30 [&::-webkit-search-cancel-button]:hidden"
          />
          {list.searchQuery ? (
            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={() => {
                list.setSearchQuery("");
                searchRef.current?.focus();
              }}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <Kbd className="absolute top-1/2 right-3 hidden -translate-y-1/2 lg:inline-flex">/</Kbd>
          )}
        </div>

        {(isSearching || list.sideFilter !== "all") && list.filteredEntries.length > 0 ? (
          <p className="num w-full text-[13px] text-muted-foreground">
            {formatNumber(list.filteredEntries.length)}명 · 합계{" "}
            <span className="font-semibold text-foreground">
              {formatNumber(list.filteredTotal)}원
            </span>
          </p>
        ) : null}
      </header>

      <div className="flex-1 px-2 py-2 sm:px-3">
        {isLoading ? (
          <SkeletonRows />
        ) : error ? (
          <EmptyState
            title="목록을 불러오지 못했어요"
            description={error}
            action={
              <Button variant="outline" className="gap-1.5 rounded-lg" onClick={() => void onRetry()}>
                <RotateCw className="size-3.5" /> 다시 시도
              </Button>
            }
          />
        ) : list.filteredEntries.length === 0 ? (
          isSearching ? (
            <EmptyState
              title={`‘${list.searchQuery.trim()}’ 검색 결과가 없어요`}
              description="초성이나 메모 내용으로도 찾을 수 있어요."
              action={
                <Button variant="outline" className="rounded-lg" onClick={() => list.setSearchQuery("")}>
                  검색 초기화
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon
              title="아직 입력된 축의금이 없어요"
              description="왼쪽에서 첫 번째 축의금을 입력해 보세요."
            />
          )
        ) : (
          <ul className="divide-y divide-border/60">
            {list.paginatedEntries.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(entry.id)}
                  className={cn(
                    "group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none",
                    highlightId === entry.id && "animate-row-flash",
                  )}
                >
                  <GuestAvatar name={entry.guest_name} side={entry.side} />
                  <span className="min-w-0">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate text-[15px] font-semibold">
                        <Highlight text={entry.guest_name} query={list.searchQuery} />
                      </span>
                      <RelationTag relation={entry.relation} />
                    </span>
                    <span className="block truncate text-[13px] text-muted-foreground">
                      {entry.memo ? (
                        <Highlight text={entry.memo} query={list.searchQuery} />
                      ) : (
                        <span
                          title={formatDateTime(entry.created_at)}
                          className="text-muted-foreground/70"
                        >
                          {formatRelative(entry.created_at, now)}
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="num block text-[15px] font-semibold">
                      {formatNumber(entry.amount)}
                      <span className="ml-0.5 text-[13px] font-medium text-muted-foreground">원</span>
                    </span>
                    {entry.memo ? (
                      <span
                        title={formatDateTime(entry.created_at)}
                        className="block text-xs text-muted-foreground/70"
                      >
                        {formatRelative(entry.created_at, now)}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!isLoading && list.totalPages > 1 ? (
        <footer className="flex items-center justify-between gap-3 border-t px-5 py-3 sm:px-6">
          <p className="num text-xs text-muted-foreground">
            {rangeStart}–{rangeEnd} / {list.filteredEntries.length}건
          </p>
          <Pagination
            current={list.currentPage}
            total={list.totalPages}
            onChange={list.setCurrentPage}
          />
        </footer>
      ) : null}

      <EntryDetailSheet
        entry={selectedEntry ?? lastSelected}
        open={Boolean(selectedEntry)}
        onClose={() => setSelectedId(null)}
        onUpdated={onUpdated}
        onDelete={(entry) => {
          setSelectedId(null);
          onDelete(entry);
        }}
      />
    </section>
  );
}

const SIDE_FILTERS = [
  ["all", "전체"],
  ["groom", "신랑측"],
  ["bride", "신부측"],
] as const;

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const index = text.toLowerCase().indexOf(q.toLowerCase());
  if (index < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-sm bg-brand/20 px-0.5 text-inherit">
        {text.slice(index, index + q.length)}
      </mark>
      {text.slice(index + q.length)}
    </>
  );
}

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  const pages = getPageWindow(current, total);
  return (
    <nav aria-label="페이지" className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="이전 페이지"
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
      >
        <ChevronLeft />
      </Button>
      {pages.map((page, index) =>
        page === "…" ? (
          <span key={`gap-${index}`} className="w-6 text-center text-xs text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-current={page === current ? "page" : undefined}
            onClick={() => onChange(page)}
            className={cn(
              "num size-7 rounded-lg text-[13px] font-medium transition-colors",
              page === current
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {page}
          </button>
        ),
      )}
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="다음 페이지"
        disabled={current === total}
        onClick={() => onChange(current + 1)}
      >
        <ChevronRight />
      </Button>
    </nav>
  );
}

function getPageWindow(current: number, total: number): (number | "…")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "…", total];
  if (current >= total - 2) return [1, "…", total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

function SkeletonRows() {
  return (
    <ul aria-busy className="divide-y divide-border/60">
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 px-3 py-3">
          <span className="skeleton size-10 rounded-full" />
          <span className="space-y-1.5">
            <span className="skeleton block h-4 w-20" />
            <span className="skeleton block h-3 w-32" />
          </span>
          <span className="skeleton block h-4 w-16" />
        </li>
      ))}
    </ul>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: boolean;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center animate-in fade-in">
      {icon ? (
        <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <Gift className="size-6" />
        </span>
      ) : null}
      <div className="space-y-1">
        <p className="text-[15px] font-semibold">{title}</p>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
