import { SYSTEM_PROMPT } from "@/api/assistant/prompt";
import { bodySchema } from "@/api/schema/assistant_schema";
import { AllProvidersFailedError } from "@/lib/client_lib/client_lib";
import { createChatCompletion } from "@/lib/openai/client";
import { NextResponse } from "next/server";
import { z } from "zod";


export async function POST(request: Request){
    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if(!parsed.success){
        return NextResponse.json({
            error: "Invalid request body",
        },{ status: 400 });
    }

    try{
        const { completion, model} = await createChatCompletion({
            messages: [
                { role: SYSTEM_PROMPT.system_role, content: SYSTEM_PROMPT.content },
                { role: SYSTEM_PROMPT.user_role, content: parsed.data.message}
            ],
        });

        return NextResponse.json({
            reply: completion.choices[0]?.message?.content ?? "",
            model,
            usage: completion.usage,
        });
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