import { NextResponse } from "next/server";

import { createEntrySchema, type Entry } from "@/shared/lib/schemas/entry";
import { fetchAllActiveEntries } from "@/shared/lib/supabase/entries";
import { createServerSupabase } from "@/shared/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerSupabase();
    const { data, error } = await fetchAllActiveEntries<Entry>(supabase, "*", false);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "서버 설정을 확인해 주세요." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createEntrySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("entries")
      .insert({
        guest_name: parsed.data.guest_name,
        amount: parsed.data.amount,
        memo: parsed.data.memo?.trim() || null,
        side: parsed.data.side,
        relation: parsed.data.relation ?? null,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "서버 설정을 확인해 주세요." },
      { status: 500 },
    );
  }
}
