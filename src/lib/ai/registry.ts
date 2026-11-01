import type OpenAI from "openai";
import { RegisteredTool } from "./tool-types";
import { getListingsTool } from "./tools/get-listing";
import { searchListingsTool } from "./tools/search-listing";


const ALL_TOOLS: RegisteredTool[] = [searchListingsTool, getListingsTool];

const registry = new Map<string, RegisteredTool>();

for (const tool of ALL_TOOLS) {
  if (registry.has(tool.name)) {
    throw new Error(`Duplicate tool name: ${tool.name}`);
  }
  registry.set(tool.name, tool);
}   


export function getToolDefinitions(): OpenAI.Chat.ChatCompletionTool[] {
  return [
    ...registry.values()].map((t) => ({
    type: "function",
    function: { 
        name: t.name, 
        description: t.description, 
        parameters: t.parameters },
  }));
}


// EXECUTION TOOLS

export async function executeTool(name: string, rawArgs: string): Promise<unknown>{
    const tool = registry.get(name);

    if(!tool) return { error: `Unknown Tool: ${name}`};

    const args = tryParse(rawArgs);
    if(!args.ok) return { error: args.error };

    try{
        return await tool.execute(args.data)
    } catch{
        return { error: "Arguments were not valid JSON"};
    }
} 


// TRY to PARSE
function tryParse(raw: string): {ok: true; data: unknown} | {ok:false; error: string} {
  try {
    return { 
        ok: true, 
        data: JSON.parse(raw || "{}") 
    };
  } catch {
    return { 
        ok: false, 
        error: "Arguments were not valid JSON" 
    };
  }
}