import type { SupabaseClient } from "@supabase/supabase-js";

// Supabase API는 한 번에 반환하는 행 수가 제한돼 있어(max_rows, 기본 1000) 끊어서 모두 가져온다.
const BATCH_SIZE = 1000;

export async function fetchAllActiveEntries<T>(
  supabase: SupabaseClient,
  columns: string,
  ascending: boolean,
): Promise<{ data: T[]; error: string | null }> {
  const all: T[] = [];

  for (let from = 0; ; from += BATCH_SIZE) {
    const { data, error } = await supabase
      .from("entries")
      .select(columns)
      .is("deleted_at", null)
      .order("created_at", { ascending })
      .order("id", { ascending })
      .range(from, from + BATCH_SIZE - 1);

    if (error) return { data: [], error: error.message };

    const rows = (data ?? []) as T[];
    all.push(...rows);
    if (rows.length < BATCH_SIZE) break;
  }

  return { data: all, error: null };
}
