import z from "zod";


const bodySchema = z.object({
    message: z.string().min(1).max(2000), 
});


const argsSchema = z.object({
    location: z.string().optional(),
    property_type: z.enum(["Condominium", "House", "Lot", "Commercial"]).optional(),
    max_price: z.number().optional(),
});



export { bodySchema, argsSchema };