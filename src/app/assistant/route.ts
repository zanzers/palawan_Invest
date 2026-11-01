import OpenAI from "openai";
import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/api/assistant/prompt";
import { bodySchema } from "@/api/schema/assistant_schema";

import { AllProvidersFailedError } from "@/lib/client_lib/client_lib";
import { createChatCompletion } from "@/lib/openai/client";
import { executeTool, getToolDefinitions } from "@/lib/ai/registry";



const MAX_STEPS = 4;

export async function POST(request: Request){
    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if(!parsed.success){
        return NextResponse.json({  error: "Invalid request body",},{ status: 400 });
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: SYSTEM_PROMPT.system_role, content: SYSTEM_PROMPT.search_listings_tool },
        { role: SYSTEM_PROMPT.user_role, content: parsed.data.message}
    ];
    const toolsUsed: string[] = [];


    try{
        for(let step = 0; step < MAX_STEPS; step++){
            const { completion, model} = await createChatCompletion({
                messages,
                tools: getToolDefinitions(),
            });

            const assistantMessage = completion.choices[0]?.message;
            if (!assistantMessage) break;

            
            if(!assistantMessage.tool_calls?.length){
                return NextResponse.json({
                    reply: assistantMessage?.content ?? "",
                    model,
                    toolsUsed,
                    usage: completion.usage,
                });
            }

            messages.push(assistantMessage);
            for (const call of assistantMessage.tool_calls) {
                if(call.type !== "function") continue;

                console.log(`[tool] $[call.function.name]`, call.function.arguments);

                toolsUsed.push(call.function.name);
                const result = await executeTool(call.function.name, call.function.arguments);

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