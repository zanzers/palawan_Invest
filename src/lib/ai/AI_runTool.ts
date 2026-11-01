import { searchListings } from "./tools/search-listing";



export function runTool(name: string, rawArgs: string): unknown{

    let  args: unknown;
    try{
        args = JSON.parse(rawArgs || "{}");
    } catch {
        return {
            error: "Invalid JSON arguments"
        };
    }

    switch(name){
        case "search_listings":
            return searchListings(args);
        default:
            return {
                error: `Unknown tool: ${name}`
            };
    }

}