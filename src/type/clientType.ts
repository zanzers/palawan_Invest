export type AssistantReply ={
    reply: string;
    model: string;
}

export type LLMTargets = {
    name: string;
    baseURL: string;
    apikey: string;
    model: string;
}

export type LLMFailures = {
    target: string;
    model: string;
    message: string;
}
