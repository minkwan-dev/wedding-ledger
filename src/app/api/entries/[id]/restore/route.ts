import { NextResponse } from "next/server";

import { createServerSupabase } from "@/shared/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("entries")
      .update({
        deleted_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .not("deleted_at", "is", null)
      .select("*")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "항목을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "서버 설정을 확인해 주세요." },
      { status: 500 },
    );
  }
}
