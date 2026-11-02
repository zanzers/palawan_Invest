import { HistoryMessage, ToolRuns } from "@/type/clientType";
import { SupabaseClient } from "@supabase/supabase-js";


const HISTORY_LIMIT = 10;

export async function createConversation(db: SupabaseClient, title: string): Promise<string>{

    const { data, error} = await db
        .from("conversations")
        .insert({title: title.slice(0, 60)})
        .select("id")
        .single();

    if(error) throw new Error (`Could not create conversation: ${error.message}`);
    return data.id as string;
}


export async function loadHistory(db: SupabaseClient, conversationId: string): Promise<HistoryMessage[] | null>{

    const { data: convo, error: convoError } = await db
        .from("conversations")
        .select("id")
        .eq("id", conversationId)
        .maybeSingle();

    if(convoError) throw new Error(`Could not load conversation: ${convoError.message}`);
    if(!convo) return null;

    const { data, error } = await db
        .from("messages")
        .select("role, content")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false})
        .limit(HISTORY_LIMIT);

    if (error) throw new Error(`Could not load messages: ${error.message}`);

    return ((data ?? []) as HistoryMessage[]).reverse();
}


export async function saveTurn(db: SupabaseClient, turn: { conversationId: string; userText: string; assistantText: string; toolRuns: ToolRuns[]}): Promise<void>{

    const now = Date.now();
    const { data, error } = await db
        .from("messages")
        .insert([
           { 
                conversation_id: turn.conversationId,
                role: "user",
                content: turn.userText,
                created_at: new Date(now).toISOString(),
            },
            {
                conversation_id: turn.conversationId,
                role: "assistant",
                content: turn.assistantText,
                created_at: new Date(now + 1).toISOString(),
            }
        ])
        .select("id ,role");
    
    if (error) throw new Error(`Could not save messages: ${error.message}`);

    const assistantId = ((data ?? []) as {id: string; role: string}[]).find((m) => m.role === "assistant")?.id ?? null;

    if(turn.toolRuns.length > 0){
        const { error: toolError} = await db
            .from("tool_executions")
            .insert(turn.toolRuns.map((run) => ({
                conversation_id: turn.conversationId,
                message_id: assistantId,
                tool_name: run.tool_name,
                arguments: run.arguments,
                execution_status: run.status,
                result: run.result,
            }))
        );
        if(toolError) throw new Error(`Could not save tool runs: ${toolError.message}`);
    }

    await db.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", turn.conversationId);
}






