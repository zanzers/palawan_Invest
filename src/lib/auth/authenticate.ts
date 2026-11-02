import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getUserSupabase } from "@/lib/supabase/user";

export async function authenticate( request: Request,): Promise<{ db: SupabaseClient } | { response: NextResponse }> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { response: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };
  

  const db = getUserSupabase(token);
  const { error } = await db.auth.getUser(token);
  if (error) return { response: NextResponse.json({ error: "Invalid session" }, { status: 401 }) };
  

  return { db };
}