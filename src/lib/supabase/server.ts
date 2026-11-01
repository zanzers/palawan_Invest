import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if(!url || !key) throw new Error("Supabase URL or key is not defined in environment variables.");

    client ??= createClient(url, key, {auth: {persistSession: false}});
    return client;
}
