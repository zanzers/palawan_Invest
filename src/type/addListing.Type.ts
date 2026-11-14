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
  title: string;
  description: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  price: string;
  amenities: string[];
  location: string;          
  latitude: number | null;  
  longitude: number | null;
};

type SetField = <K extends keyof ListingDraft>(key: K, value: ListingDraft[K]) => void;

export const EMPTY_DRAFT: ListingDraft = {
  title: "",
  description: "",
  propertyType: "",
  bedrooms: "",
  bathrooms: "",
  area: "",
  price: "",
  amenities: [],
  location: "",
  latitude: null,
  longitude: null,
};


export type {
    UnitDraft,
    ListingDraft,
    StepId,
    FieldErrors,
    SetField
}