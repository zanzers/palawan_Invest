type AssistantReply ={
    reply: string;
    model: string;
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


export type {AssistantReply, LLMFailures, LLMTargets,DirectListing }