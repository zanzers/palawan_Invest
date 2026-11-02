import { createClient } from "@supabase/supabase-js";


export function getUserSupabase(accesToken: string){

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if(!url || !key ) throw new Error("Supabase env vars are not set");

    return createClient(url, key, {
        global: { headers: { Authorization: `Bearer ${accesToken}`}},
        auth: { persistSession: false, autoRefreshToken: false },
    });
}

