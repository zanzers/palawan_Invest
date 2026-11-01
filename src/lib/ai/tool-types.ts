import {z} from "zod";

export type RegisteredTool = {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
    execute: (rawArgs: unknown) => Promise<unknown>;
};

// need to pair JSON schema for the model with a Zod schema from the RegisteredTool definition. 
// By using both JSON schema and Zod schema, 
// it can ensure that the data received from the model is valid and can be safely used within our application.
export function defineTool< S extends z.ZodType>(config: { name: string; description: string; parameters: Record<string, unknown>; schema: S; handler: (args: z.infer<S>) => unknown | Promise<unknown>;}): RegisteredTool {

    return {
        name: config.name,
        description: config.description,
        parameters: config.parameters,
        execute: async (rawArgs) => {
            const parsed = config.schema.safeParse(rawArgs);
            return parsed.success ? await config.handler(parsed.data) : {error: "Invalid arguments", issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`)}
    }
  }
}
