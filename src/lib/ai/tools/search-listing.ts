import z from "zod";
import {PROPERTY_TYPES} from "@/type/db_types";
import {defineTool} from "@/lib/ai/tool-types";
import { LISTINGS } from "@/services/listing/fake-data";
import { SEARCHLISTINGS_PROMPT } from "@/api/assistant/prompt";

export const searchListingsTool = defineTool({
  name: SEARCHLISTINGS_PROMPT.name,
      description: SEARCHLISTINGS_PROMPT.description,
      parameters: {
        type: "object",
        properties: {
          location: { type: "string", description: "City or area, e.g. Makati" },
          property_type: { type: "string", enum: [...PROPERTY_TYPES]},
          max_price: { type: "number", description: "Maximum price in PHP" },
        },
        additionalProperties: false,
      },
      schema: z.object({
        location: z.string().optional(),
        property_type: z.enum([...PROPERTY_TYPES]).optional(),
        max_price: z.number().optional(),
      }),
      handler: ({location, property_type, max_price}) => {
        const result = LISTINGS.filter(
          (l) =>
        (!location || l.location.toLowerCase().includes(location.toLowerCase())) &&
        (!property_type || l.property_type === property_type) &&
        (max_price === undefined || l.price <= max_price),
        ).slice(0, 5);

        return { count: result.length, listings: result };
        
      },
  });


