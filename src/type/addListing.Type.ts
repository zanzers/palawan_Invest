type StepId = 1 | 2 | 3 | 4;
type FieldErrors = Record<string, string>;


type UnitDraft = {
    id: string;
    unitType: string;
    price: string;
    floorArea: string;
    lotArea: string;
    bedrooms: string;
    bathrooms: string;
};

type ListingDraft = {
    description: string;
    title: string;
    category: "" | "rental" | "brokerage" | "project";
    listing_type: "" | "sale" | "rent";
    developer: string;
    units: UnitDraft[];
    amenities: string[];
    location: string;
    address: string;
    latitude: string;
    longitude: string;
};


export const STEP_FIELDS: Record<StepId, string[]> = {
  1: ["description"],
  2: ["title", "category", "listing_type", "developer", "units"],
  3: ["amenities"],
  4: ["location", "address", "latitude", "longitude"],
};


export type {
    UnitDraft,
    ListingDraft,
    StepId,
    FieldErrors
}