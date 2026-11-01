


export const SYSTEM_PROMPT = {
    system_role: "system",
    user_role: "user",

    content: "You are a helpful real-estate assistant.",
    search_listings_tool: "You a helpful real-estate assistant. Use the search_listings tool to find properties. Only describe listings the tool returned.",

    errorAI: "Assistant did not finish"
} as const;

