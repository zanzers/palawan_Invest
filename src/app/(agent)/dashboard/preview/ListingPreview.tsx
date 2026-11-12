import { MapPinIcon } from "@phosphor-icons/react";
import { LOCATIONS } from "@/app/config/filterOptions";

import { ListingDraft, SetField } from "@/type/addTypes";
import { fieldClass, Label, Section, Select } from "@/components/dashboard/create.components/fields";


export default function PropertyLocation({
  draft,
  set,
}: {
  draft: ListingDraft;
  set: SetField;
}) {
  return (
    <Section title="Property location">
      <Select
        id="location"
        label="Location"
        value={draft.location}
        onChange={(v) => set("location", v)}
        options={LOCATIONS}
        placeholder="Select city"
      />

      <div>
        <Label htmlFor="address">Street address</Label>
        <input
          id="address"
          className={fieldClass}
          placeholder="Street, barangay"
          value={draft.address}
          onChange={(e) => set("address", e.target.value)}
        />
      </div>

      <div>
        <Label>Map</Label>
        {/* Swap for Leaflet / Mapbox and store lat/lng when ready. */}
        <div className="flex h-44 flex-col items-center justify-center gap-1 rounded-xl bg-slate-100 text-slate-400">
          <MapPinIcon size={28} />
          <span className="text-xs">Map pin picker goes here</span>
        </div>
      </div>
    </Section>
  );
}