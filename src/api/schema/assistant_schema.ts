import z from "zod";


const bodySchema = z.object({
    message: z.string().min(1).max(2000), 
});

const priceParam = z.preprocess(
    (v) => {
        if(typeof v !== "string") return v;
        const cleaned = v.replace(/[,\s₱]/g, "");
        return cleaned === "" ? undefined : cleaned;

    },
    z.coerce.number().positive().optional(),
);

const listingFiltersSchema = z.object({
    location: z.string().optional(),
    property_type: z.enum(["Condominium", "House", "Lot", "Commercial"]).optional(),
    max_price: priceParam,
});



export { bodySchema, listingFiltersSchema };