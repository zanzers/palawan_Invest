import OpenAI from "openai";
import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/app/api/assistant/prompt";
import { bodySchema } from "@/app/api/schema/assistant_schema";

import { AllProvidersFailedError } from "@/lib/client_lib/client_lib";
import { createChatCompletion } from "@/lib/openai/client";
import { executeTool, getToolDefinitions } from "@/lib/ai/registry";
import { HistoryMessage, ToolRuns } from "@/type/clientType";
import { createConversation, loadHistory, saveTurn } from "@/services/conversation/conversations";
import { authenticate } from "@/lib/auth/authenticate";
import { consumeRequest } from "@/services/usage/usage";


const MAX_STEPS = 4;

export async function POST(request: Request){

    if (process.env.ASSISTANT_ENABLED !== "true") return NextResponse.json({ error: "Not found"}, {status: 404});
    

    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if(!parsed.success) return NextResponse.json({  error: "Invalid request body",},{ status: 400 });

    const auth = await authenticate(request);
    if("response" in auth) return auth.response;
    const { db } = auth;

    const limited = await consumeRequest(db);
    if(limited) return limited;
    

    const seenCalls = new Set<string>();
    const toolsUsed: string[] = [];
    const toolRuns: ToolRuns[] = [];


    try{
        let conversationId: string | null = parsed.data.conversation_id ?? null;
        let history: HistoryMessage[] = [];

        if(conversationId){
            const loaded = await loadHistory(db, conversationId);
            
            if (!loaded) {
                return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
            }
            history = loaded;
        }

         const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            { role: SYSTEM_PROMPT.system_role, content: SYSTEM_PROMPT.search_listings_tool },
            ...history.map(
                (m) => ({ role: m.role, content: m.content}) as OpenAI.Chat.ChatCompletionMessageParam,
            ),
            { role: SYSTEM_PROMPT.user_role, content: parsed.data.message}
        ];


        for(let step = 0; step < MAX_STEPS; step++){
            const { completion, model} = await createChatCompletion({
                messages,
                tools: getToolDefinitions(),
            });

            const assistantMessage = completion.choices[0]?.message;
            if (!assistantMessage) break;

            
            if(!assistantMessage.tool_calls?.length){
                const replyText = assistantMessage.content ?? "";

                try {
                    conversationId ??= await createConversation(db, parsed.data.message);
                    await saveTurn(db, {
                        conversationId,
                        userText: parsed.data.message,
                        assistantText: replyText,
                        toolRuns,
                    });
                } catch (saveError) {
                    console.error("Failed to save conversation:", saveError);
                }

                return NextResponse.json({
                    reply: replyText,
                    model,
                    toolsUsed,
                    conversation_id: conversationId, 
                    usage: completion.usage,
                });
            }

            messages.push(assistantMessage);
            for (const call of assistantMessage.tool_calls) {
                if(call.type !== "function") continue;

                console.log(`[tool] ${call.function.name}`, call.function.arguments);

                toolsUsed.push(call.function.name);
                const key = `${call.function.name}:${call.function.arguments}`;
                const isRepeat = seenCalls.has(key);
                const result = isRepeat
                    ? { error: "You already made this exact call. Use the earlier result to answer the user."}
                    : await executeTool(call.function.name, call.function.arguments); 
                seenCalls.add(key);

                console.log("[Tool result]", JSON.stringify(result).slice(0, 300));
                if(!isRepeat){
                    let parsedArgs: unknown = call.function.arguments;
                    try {parsedArgs = JSON.parse(call.function.arguments || "{}")} catch {};

                    toolRuns.push({
                        tool_name: call.function.name,
                        arguments: parsedArgs,
                        status: typeof result === "object" && result !== null && "error" in result ? "error" : "success",
                        result,
                    });
                    
                }



                messages.push({
                    role: "tool",
                    tool_call_id: call.id,
                    content: JSON.stringify(result),
                });
            }
        }

        return NextResponse.json(
            { error: SYSTEM_PROMPT.errorAI},
            { status: 502 }
        )

    } catch(err){
        if(err instanceof AllProvidersFailedError){
            console.error("ALL LLM providers failed:", err.failures);
            
            return NextResponse.json(
                { error: "The Assistant is temporarily unavailable."},
                {status: 503}
            );

        }
        console.error("Assistant error:", err);
        return NextResponse.json(
            { error: "Assistance request failed"},
            { status: 500}
        )
    }

}