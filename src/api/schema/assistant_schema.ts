import z from "zod";


const bodySchema = z.object({
    message: z.string().min(1).max(2000), 
});


export { bodySchema };