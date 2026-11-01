import z from "zod";
import { defineTool } from "../tool-types";
import { GETLISTINGS_PROMPT } from "@/api/assistant/prompt";
import { getListingByCode } from "@/services/listing/listings";


export const getListingsTool = defineTool({
  name: GETLISTINGS_PROMPT.name,
      description: GETLISTINGS_PROMPT.description,
      parameters: {
        type: "object",
        properties: {
           id: {type: "string", description: "listing code, e.g L-003"},
        },
        required: ["code"],
        additionalProperties: false,
      },
      schema: z.object({ code: z.string().min(1)}),

      handler: async ({ code }) => {
        const listing = await getListingByCode(code);
        return listing ?? {
          error: `No listing found with  code ${code}`
        }
      },
  });















