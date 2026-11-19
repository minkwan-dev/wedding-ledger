import * as XLSX from "xlsx";
import { NextResponse } from "next/server";

import { RELATION_LABELS, SIDE_LABELS } from "@/shared/lib/constants";
import { formatDateTime } from "@/shared/lib/format";
import type { Entry } from "@/shared/lib/schemas/entry";
import { fetchAllActiveEntries } from "@/shared/lib/supabase/entries";
import { createServerSupabase } from "@/shared/lib/supabase/server";

type ExportEntry = Pick<
  Entry,
  "guest_name" | "amount" | "memo" | "side" | "relation" | "created_at" | "updated_at"
>;

const AMOUNT_FORMAT = '#,##0"원"';
const sideLabel = (side: Entry["side"]) => (side ? SIDE_LABELS[side] : "미지정");
const relationLabel = (relation: Entry["relation"]) =>
  relation ? RELATION_LABELS[relation] : "";

function formatAmountColumn(sheet: XLSX.WorkSheet, column: string, lastRow: number) {
  for (let row = 2; row <= lastRow; row += 1) {
    const cell = sheet[`${column}${row}`];
    if (cell && typeof cell.v === "number") cell.z = AMOUNT_FORMAT;
  }
}

function buildEntrySheet(entries: ExportEntry[]) {
  const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const header = ["번호", "구분", "관계", "성함", "금액", "메모", "입력일시", "수정일시"];
  const rows = entries.map((entry, index) => [
    index + 1,
    sideLabel(entry.side),
    relationLabel(entry.relation),
    entry.guest_name,
    entry.amount,
    entry.memo ?? "",
    formatDateTime(entry.created_at),
    formatDateTime(entry.updated_at),
  ]);
  const footer = ["", "", "", `합계 (${entries.length}건)`, total, "", "", ""];

  const sheet = XLSX.utils.aoa_to_sheet([header, ...rows, [], footer]);
  sheet["!cols"] = [6, 8, 12, 14, 14, 32, 22, 22].map((wch) => ({ wch }));
  sheet["!autofilter"] = { ref: `A1:H${rows.length + 1}` };
  formatAmountColumn(sheet, "E", rows.length + 3);
  return sheet;
}

function buildSummarySheet(entries: ExportEntry[]) {
  const groups: { label: string; list: ExportEntry[] }[] = [
    { label: "전체", list: entries },
    { label: "신랑측", list: entries.filter((e) => e.side === "groom") },
    { label: "신부측", list: entries.filter((e) => e.side === "bride") },
  ];
  const unassigned = entries.filter((e) => !e.side);
  if (unassigned.length) groups.push({ label: "미지정", list: unassigned });

  const rows: (string | number)[][] = [["구분", "건수", "합계", "평균"]];
  // [행 번호(0부터), 금액 열 번호들]
  const amountCells: [number, number[]][] = [];
  for (const { label, list } of groups) {
    const sum = list.reduce((s, e) => s + e.amount, 0);
    amountCells.push([rows.length, [2, 3]]);
    rows.push([label, list.length, sum, list.length ? Math.round(sum / list.length) : 0]);
  }

  rows.push([], ["관계", "신랑측 건수", "신랑측 합계", "신부측 건수", "신부측 합계"]);
  const relationKeys = [...(Object.keys(RELATION_LABELS) as (keyof typeof RELATION_LABELS)[]), null];
  for (const relation of relationKeys) {
    const groom = entries.filter((e) => e.side === "groom" && e.relation === relation);
    const bride = entries.filter((e) => e.side === "bride" && e.relation === relation);
    if (!groom.length && !bride.length) continue;
    amountCells.push([rows.length, [2, 4]]);
    rows.push([
      relation ? RELATION_LABELS[relation] : "미지정",
      groom.length,
      groom.reduce((s, e) => s + e.amount, 0),
      bride.length,
      bride.reduce((s, e) => s + e.amount, 0),
    ]);
  }

  const sheet = XLSX.utils.aoa_to_sheet(rows);
  sheet["!cols"] = [14, 12, 16, 12, 16].map((wch) => ({ wch }));
  for (const [r, columns] of amountCells) {
    for (const c of columns) {
      const cell = sheet[XLSX.utils.encode_cell({ r, c })];
      if (cell) cell.z = AMOUNT_FORMAT;
    }
  }
  return sheet;
}

export async function GET() {
  try {
    const supabase = createServerSupabase();
    const { data: entries, error } = await fetchAllActiveEntries<ExportEntry>(
      supabase,
      "guest_name, amount, memo, side, relation, created_at, updated_at",
      true,
    );

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, buildSummarySheet(entries), "요약");
    XLSX.utils.book_append_sheet(workbook, buildEntrySheet(entries), "전체");
    XLSX.utils.book_append_sheet(
      workbook,
      buildEntrySheet(entries.filter((e) => e.side === "groom")),
      "신랑측",
    );
    XLSX.utils.book_append_sheet(
      workbook,
      buildEntrySheet(entries.filter((e) => e.side === "bride")),
      "신부측",
    );

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    const filename = `축의금_${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "서버 설정을 확인해 주세요." },
      { status: 500 },
    );
  }
}
