import { NextResponse } from "next/server";
import { AuthResult } from "@/type/clientType";
import { getUserSupabase } from "@/lib/supabase/user";

export async function authenticate( request: Request,): Promise<AuthResult > {
  
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { response: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };
  

  const db = getUserSupabase(token);
  const {data, error} = await db.auth.getUser(token);
  

  if (error || !data.user) return { response: NextResponse.json({ error: "Invalid session" }, { status: 401 }) };
  

  return { db, user: data.user};
}