import { ListingDraft, UnitDraft } from "./addListing.Type";

export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

export const newUnit = (): UnitDraft => ({
  id: uid(),
  unitType: "",
  price: "",
  floorArea: "",
  lotArea: "",
  bedrooms: "",
  bathrooms: "",
});

export const createEmptyDraft = (): ListingDraft => ({
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
});



