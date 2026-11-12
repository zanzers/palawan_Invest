export type ListingDraft = {
  area: string | number | readonly string[] | undefined;
  title: string;
  description: string;
  propertyType: string;
  bedrooms: string; // "" = Any
  bathrooms: string; // "" = Any
  lotArea: string;
  floorArea: string;
  amenities: string[];
  price: string;
  location: string;
  address: string;
};

export const EMPTY_DRAFT: ListingDraft = {
  title: "",
  description: "",
  propertyType: "",
  bedrooms: "",
  bathrooms: "",
  lotArea: "",
  floorArea: "",
  amenities: [],
  price: "",
  location: "",
  area:"",
  address: "",
};

export type SetField = <K extends keyof ListingDraft>(key: K, value: ListingDraft[K]) => void;