"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { formatCurrency } from "@/shared/lib/format";
import type { Entry } from "@/shared/lib/schemas/entry";

type EntryRowMenuProps = {
  entry: Entry;
  onEdit: (entry: Entry) => void;
  onDelete: (entry: Entry) => void;
};

export function EntryRowMenu({ entry, onEdit, onDelete }: EntryRowMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label={`${entry.guest_name} 관리`}
          />
        }
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="font-medium text-foreground">{entry.guest_name}</p>
          <p className="text-xs text-muted-foreground">{formatCurrency(entry.amount)}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-2">
          <p className="mb-1 text-xs font-medium text-muted-foreground">메모</p>
          <p className="text-sm leading-relaxed text-foreground">
            {entry.memo?.trim() ? entry.memo : "메모 없음"}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onEdit(entry)}>
          <Pencil />
          수정
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(entry)}>
          <Trash2 />
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
