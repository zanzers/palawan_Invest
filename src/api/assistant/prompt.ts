


export const SYSTEM_PROMPT = {
    system_role: "system",
    user_role: "user",

    content: "You are a helpful real-estate assistant.",
    search_listings_tool: "You a helpful real-estate assistant. Use the search_listings tool to find properties. Only describe listings the tool returned.",

    errorAI: "Assistant did not finish"
} as const;


export const SEARCHLISTINGS_PROMPT = {
    name: "search_listings",
    description: "Search property listings. Use when the user asks to find or browse properties. All filters are optional."
}

export const GETLISTINGS_PROMPT = {
    name: "get_listings",
    description: "Get the full details of one listing by its id (for example L-003). Use after a search when the user wants more about a specific property."
}