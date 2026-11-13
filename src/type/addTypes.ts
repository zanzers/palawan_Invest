export type ListingDraft = {
  area: string | number | readonly string[] | undefined;
  title: string;
  description: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  lotArea: string;
  floorArea: string;
  amenities: string[];
  price: string;
  location: string;
  address: string;

  latitude: number | null;
  longitude: number | null;

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
  latitude: null,
  longitude: null,
};

export type SetField = <K extends keyof ListingDraft>(key: K, value: ListingDraft[K]) => void;