import z from "zod";


const bodySchema = z.object({
    message: z.string().min(1).max(2000), 
    conversation_id: z.string().uuid().optional(),
});

const priceParam = z.preprocess(
    (v) => {
        if(typeof v !== "string") return v;
        const cleaned = v.replace(/[,\s₱]/g, "");
        return cleaned === "" ? undefined : cleaned;

    },
    z.coerce.number().positive().optional(),
);

const cleanLocation = (v: string) =>
    v.replace(/\b(city of|city)\b/gi, "").replace(/\s+/g, " ").trim();

const listingFiltersSchema = z.object({
    location: z.string().optional(),
    property_type: z.enum(["Condominium", "House", "Lot", "Commercial"]).optional(),
    max_price: priceParam,
});




export { bodySchema, listingFiltersSchema, cleanLocation };