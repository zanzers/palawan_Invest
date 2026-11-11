import type { ComponentType } from "react";
import type { ListingForm } from "./useListingForm";
import { StepId } from "@/type/addListing.Type";
import StepPaste from "./StepPaste";

export type StepProps = { form: ListingForm };

export const STEPS = [
  { id: 1, label: "Describe" },
  { id: 2, label: "Details" },
  { id: 3, label: "Amenities" },
  { id: 4, label: "Location" },
] as const;

export default function Stub({ title, hint, fields }: { title: string; hint: string; fields: string[] }) {
  return (
    <div>
      <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{hint}</p>
      <ul className="mt-4 space-y-2 rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
        {fields.map((f) => (
          <li key={f}>• {f}</li>
        ))}
      </ul>
    </div>
  );
}



function StepDetails() {
  return (
    <Stub
      title="Details"
      hint="The basics. Only projects can have several units."
      fields={["Title", "Category (rental, brokerage, project)", "Sale or rent", "Developer", "Unit(s): type, price, areas, bedrooms, bathrooms"]}
    />
  );
}

function StepAmenities() {
  return <Stub title="Amenities" hint="Tap what applies." fields={["Amenity chips", "Other amenities"]} />;
}

function StepLocation() {
  return (
    <Stub
      title="Location"
      hint="Coordinates are needed for the map."
      fields={["Area (dropdown)", "Address", "Latitude", "Longitude", "Map picker (later)"]}
    />
  );
}

export const STEP_COMPONENTS: Record<StepId, ComponentType<StepProps>> = {
  1: StepPaste,
  2: StepDetails,
  3: StepAmenities,
  4: StepLocation,
};