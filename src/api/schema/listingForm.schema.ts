import z from "zod";
import { PROPERTY_TYPES } from "@/type/db_types";
import { Categories, ListingStatus } from "@/type/listingType";

const unitSchema = z.object({
  unit_type: z.enum(PROPERTY_TYPES),
  price: z.number().positive("Enter a price above 0"),
  floor_area: z.number().positive("Must be above 0").nullable(),
  lot_area: z.number().positive("Must be above 0").nullable(),
  bedrooms: z.number().int("Whole number").min(0, "Can't be negative").nullable(),
  bathrooms: z.number().int("Whole number").min(0, "Can't be negative").nullable(),
});

export const listingSchema = z.object({
    description: z.string().max(5000, "Keep it under 5000 characters"),
    title: z.string().min(3, "At least 3 characters").max(120, "Keep it under 120 characters"),
    category: z.enum(Categories),
    listing_type: z.enum(ListingStatus),
    developer: z.string().max(120).optional(),
    units: z.array(unitSchema).min(1, "Add at least one unit"),
    amenities: z.array(z.string()).max(40),
    location: z.string().min(2, "Choose a location"),
    address: z.string().max(200, "Keep it under 200 characters").optional(),
    latitude: z.number().min(-90, "Between -90 and 90").max(90, "Between -90 and 90"),
    longitude: z.number().min(-180, "Between -180 and 180").max(180, "Between -180 and 180"),
  })
  .refine((d) => d.category === "project" || d.units.length <= 1, {
    path: ["units"],
    message: "Only projects can have several units",
  });