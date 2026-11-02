import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Rejection } from "@/type/clientType";


const REJECTIONS: Record<string, Rejection> = {
  user_limit: { status: 429, error: "You've reached today's assistant limit. You can still search directly.",},
  global_limit: { status: 429, error: "The assistant has reached its daily limit. You can still search directly.",},
  unauthenticated: { status: 401, error: "Not signed in" },
};

export async function consumeRequest(db: SupabaseClient): Promise<NextResponse | null> {
  const { data, error } = await db.rpc("consume_request");

  if (error) {
    console.error("Usage check failed:", error);
    return NextResponse.json({ error: "Assistance request failed" }, { status: 500 });
  }

  if (data === "ok") return null;

  const rejection = REJECTIONS[data as string] ?? REJECTIONS.unauthenticated;
  return NextResponse.json({ error: rejection.error }, { status: rejection.status });
}