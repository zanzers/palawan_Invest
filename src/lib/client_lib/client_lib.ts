import OpenAI from "openai";
import { LLMFailures, LLMTargets } from "@/type/clientType";


const MAX_TARGETS = 2;
const REQUEST_TIMEOUT_MS = 30_000;
const clients = new Map<string, OpenAI>();

function loadTargets(): LLMTargets[]{
    const targets: LLMTargets[] = [];

    for(let i = 1; i <= MAX_TARGETS; i++){
        const baseURL = process.env[`LLM_TARGET_${i}_BASE_URL`];
        const apikey = process.env[`LLM_TARGET_${i}_API_KEY`];
        const model = process.env[`LLM_TARGET_${i}_MODEL`];
        const name = process.env[`LLM_TARGET_${i}_NAME`];

        if(!baseURL || !apikey || !model || !name){
            continue;
        }
        targets.push({ name, baseURL, apikey, model });
    }
    return targets;
}

function getClient(target: LLMTargets): OpenAI {
    let client = clients.get(target.name);

    if(!client){
        client = new OpenAI({
        apiKey: target.apikey,
        baseURL: target.baseURL,
        timeout: REQUEST_TIMEOUT_MS,
        maxRetries: 0,
    });
    clients.set(target.name, client);
    }
    return client;
}

function describeError(err: unknown): string{

    if(err instanceof OpenAI.APIError){
        return `${err.status ?? "no status"}: ${err.message}`;
    }
    return err instanceof Error ? err.message : "Unknown error";
}


class AllProvidersFailedError extends Error {
    constructor(public readonly failures: LLMFailures[]){
        super("ALL LLM providers failed");
        this.name = "ALLProvidersFailedError";
    }
}



export {loadTargets, getClient, describeError, AllProvidersFailedError};
