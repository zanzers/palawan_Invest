import { PROPERTY_TYPES } from "@/type/db_types";
import z from "zod";



export const createListingSchema = z.object({
    title: z.string().trim().min(3).max(120),
    description: z.string().trim().max(500).optional(),
    property_type: z.enum(PROPERTY_TYPES),
    price: z.number().positive("0"),
    floor_area: z.number().positive().nullable().optional(),
    bedrooms: z.number().int().min(0).max(50).nullable().optional(),
    bathrooms: z.number().int().min(0).max(50).nullable().optional(),
    amenities: z.array(z.string().trim().min(1).max(40)).max(40),
    location: z.string().trim().min(3).max(400),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
});