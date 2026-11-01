import z from "zod";
import { defineTool } from "../tool-types";
import { GETLISTINGS_PROMPT } from "@/api/assistant/prompt";
import { LISTINGS } from "@/services/listing/fake-data";


export const getListingsTool = defineTool({
  name: GETLISTINGS_PROMPT.name,
      description: GETLISTINGS_PROMPT.description,
      parameters: {
        type: "object",
        properties: {
           id: {type: "string", description: "listing id, e.g L-003"},
        },
        required: ["id"],
        additionalProperties: false,
      },
      schema: z.object({ id: z.string().min(1)}),

      handler: ({id}) => {
        const result = LISTINGS.find((l) => l.id.toLowerCase() === id.toLocaleLowerCase());
        return result ?? { error: `No listing found with id ${id}`};
      },
  });















