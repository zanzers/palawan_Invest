import type OpenAI from "openai";
import { LISTINGS } from "@/services/listing/fake-data";
import { argsSchema } from "@/api/schema/assistant_schema";

export const searchListingsDefinition: OpenAI.Chat.ChatCompletionTool = {
  type: "function",
  function: {
    name: "search_listings",
    description:
      "Search property listings. Use when the user asks to find or browse properties. All filters are optional.",
    parameters: {
      type: "object",
      properties: {
        location: { type: "string", description: "City or area, e.g. Makati" },
        property_type: {
          type: "string",
          enum: ["Condominium", "House", "Lot", "Commercial"],
        },
        max_price: { type: "number", description: "Maximum price in PHP" },
      },
      additionalProperties: false,
    },
  },
};

export function searchListings(rawArgs: unknown){
    const parsed = argsSchema.safeParse(rawArgs);
    if(!parsed.success){
        return {
            error: "Invalid arguments",
            details: parsed.error.flatten()
        };
    }

    const {location, property_type, max_price} = parsed.data;

      const results = LISTINGS.filter(
        (l) =>
          (!location || l.location.toLowerCase().includes(location.toLowerCase())) &&
          (!property_type || l.property_type === property_type) &&
          (max_price === undefined || l.price <= max_price),
      ).slice(0, 5);
    
      return { count: results.length, listings: results };
}

