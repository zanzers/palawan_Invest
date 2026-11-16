import { getBrowserSupabase } from "@/lib/supabase/browser";




export async function getAgentProfile() {

    const supabase = getBrowserSupabase();

                    
    const {data, error} = await supabase.rpc("get_agent_profile");

    if(error) throw error;

    if(!data?.user) throw new Error("User profile not found");

    console.log("Agent Info:", data);

    return data;

}



