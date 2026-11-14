// import { FieldErrors, ListingDraft, STEP_FIELDS, StepId } from "@/type/addListing.Type";
// import { listingSchema } from "./listingForm.schema";


// const clean = (s: string) => s.replace(/[,\s₱]/g, "");
// const num = (s: string): number | undefined => (clean(s) === "" ? undefined : Number(clean(s)));
// const numOrNull = (s: string): number | null => num(s) ?? null;

// export function toPayload(d: ListingDraft) {
//   return {
//     description: d.description.trim(),
//     title: d.title.trim(),
//     category: d.category === "" ? undefined : d.category,
//     listing_type: d.listing_type === "" ? undefined : d.listing_type,
//     developer: d.developer.trim() || undefined,
//     units: d.units.map((u) => ({
//       unit_type: u.unitType === "" ? undefined : u.unitType,
//       price: num(u.price),
//       floor_area: numOrNull(u.floorArea),
//       lot_area: numOrNull(u.lotArea),
//       bedrooms: numOrNull(u.bedrooms),
//       bathrooms: numOrNull(u.bathrooms),
//     })),
//     amenities: d.amenities,
//     location: d.location.trim(),
//     address: d.address.trim() || undefined,
//     latitude: num(d.latitude),
//     longitude: num(d.longitude),
//   };
// }

// function valueAt(obj: unknown, path: PropertyKey[]): unknown {
//   return path.reduce<unknown>(
//     (acc, key) => (acc == null ? undefined : (acc as Record<PropertyKey, unknown>)[key]),
//     obj,
//   );
// }

// export function validateStep(step: StepId, draft: ListingDraft): FieldErrors {
//   const errors: FieldErrors = {};

 
//   const payload = toPayload(draft);
//   const result = listingSchema.safeParse(payload);
//   if (!result.success) {
//     for (const issue of result.error.issues) {
//       const root = String(issue.path[0] ?? "");
//       if (!STEP_FIELDS[step].includes(root)) continue;
//       const key = issue.path.map(String).join(".");
    
//       errors[key] ??= valueAt(payload, issue.path) === undefined ? "Required" : issue.message;
//     }
//   }
//   return errors;
// }