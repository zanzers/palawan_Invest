import { ListingDraft } from "@/type/addListing.Type";


const toNumber = (s: string): number | null => { const n = Number(s.replace(/[,\s]/g, "")); return s.trim() !== "" && Number.isFinite(n) ? n : null;};
const toWhole = (s: string): number | null => { const n = parseInt(s, 10); return Number.isNaN(n) ? null : n};

export function toListingPayload(d: ListingDraft) {
  return {
    title: d.title.trim(),
    description: d.description.trim() || undefined,
    property_type: d.propertyType,
    price: toNumber(d.price),
    floor_area: toNumber(d.area),
    bedrooms: toWhole(d.bedrooms),
    bathrooms: toWhole(d.bathrooms),
    amenities: d.amenities,
    location: d.location.trim(),
    latitude: d.latitude,
    longitude: d.longitude,
  };
}