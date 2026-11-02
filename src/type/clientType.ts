type AssistantReply ={
    reply: string;
    model: string;
    conversation_id: string;
}

type LLMTargets = {
    name: string;
    baseURL: string;
    apikey: string;
    model: string;
}

type LLMFailures = {
    target: string;
    model: string;
    message: string;
}


type DirectListing = {
  code: string;
  title: string;
  location: string;
  developer: string | null;
  units: { unit_type: string; price: number }[];
};


type HistoryMessage = {
    role: "user" | "assistant";
    content: string;
};

type ToolRuns = {
    tool_name: string;
    arguments: unknown;
    status: "success" | "error";
    result: unknown;
};

export type {
    AssistantReply, 
    LLMFailures, 
    LLMTargets, 
    DirectListing, 
    ToolRuns, 
    HistoryMessage 
}