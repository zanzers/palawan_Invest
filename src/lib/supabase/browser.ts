import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getBrowserSupabase(): SupabaseClient {
    client ??= createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );
    return client;
}

export async function getAccessToken(): Promise<string> {
    
    const supabase = getBrowserSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    
    if(session) return session.access_token;

    const { data, error } = await supabase.auth.signInAnonymously();
    if( error || !data.session ) throw new Error("Could not start an anonymous session");
    return data.session.access_token;


}
