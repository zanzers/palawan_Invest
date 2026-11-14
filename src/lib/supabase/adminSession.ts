import { getBrowserSupabase } from "./browser";


export async function getAdminToken(): Promise<string | null>{

    const { data: {session }} = await getBrowserSupabase().auth.getSession();
    if(!session || session.user.is_anonymous) return null;

    return session.access_token;
}