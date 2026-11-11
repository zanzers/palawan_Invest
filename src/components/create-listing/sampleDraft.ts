import { ListingDraft } from "@/type/addListing.Type";



export const SAMPLE_DRAFT: Partial<ListingDraft> = {
  description: "Two-bedroom condo near the airport, 54 sqm, with pool and gym.",
  title: "2BR condo near the airport",
  category: "brokerage",
  listing_type: "sale",
  units: [
    { id: "sample-unit", unitType: "Condominium", price: "6500000", floorArea: "54", lotArea: "", bedrooms: "2", bathrooms: "1" },
  ],
  amenities: ["Pool", "Gym"],
  location: "Puerto Princesa",
  latitude: "9.7392",
  longitude: "118.7353",
};