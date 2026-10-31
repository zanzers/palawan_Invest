import OpenAI from "openai";
import {loadTargets, getClient, describeError, AllProvidersFailedError } from "@/lib/client_lib/client_lib";
import { LLMFailures, LLMTargets } from "@/type/clientType";



export async function createChatCompletion( params: Omit<OpenAI.Chat.ChatCompletionCreateParamsNonStreaming, "model">): Promise <{completion: OpenAI.Chat.ChatCompletion; target: string, model: string }>{
    const targets = loadTargets();

    if(targets.length === 0){
        throw new Error("No LLM configured.");
    }
    
    const failures: LLMFailures[] =[];

    for(const target of targets){
        try{
            const completion = await getClient(target).chat.completions.create({
                ...params,
                model: target.model,
            });
            return { completion, target: target.name, model: target.model};
        } catch(err){
            const message = describeError(err);
            console.warn(`[llm] ${target.name} (${target.model}) failed: ${message}`);
            failures.push({target: target.name, model: target.model, message});
        }
    }

    throw new AllProvidersFailedError(failures);

    }
