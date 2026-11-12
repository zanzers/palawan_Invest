
import { PROPERTY_TYPES } from "@/app/config/filterOptions";
import { Section, Label, Select, fieldClass } from "./fields";
import { ListingDraft, SetField } from "@/type/addTypes";

const ROOM_OPTIONS = ["1", "2", "3", "4", "5+"] as const;

const digitsOnly = (v: string) => v.replace(/[^\d.]/g, "");

export default function PropertyDetails({ draft, set,}: { draft: ListingDraft; set: SetField;}) {
  return (
    <Section title="Property details">
      <div>
        <Label htmlFor="title">Property title</Label>
        <input
          id="title"
          className={fieldClass}
          placeholder="e.g. 2BR condo near Makati CBD"
          value={draft.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={4}
          className={fieldClass}
          placeholder="Describe the property, neighborhood, and what makes it stand out"
          value={draft.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <Select
        id="type"
        label="Property type"
        value={draft.propertyType}
        onChange={(v) => set("propertyType", v)}
        options={PROPERTY_TYPES}
        placeholder="Select property type"
      />

      {/* Bedrooms, Bathrooms and Area */}
      <div className="grid grid-cols-3 gap-3">
        <Select id="bedrooms" label="Bedrooms" value={draft.bedrooms} onChange={(v) => set("bedrooms", v)} options={ROOM_OPTIONS} placeholder="Any"/>

        <Select id="bathrooms" label="Bathrooms" value={draft.bathrooms} onChange={(v) => set("bathrooms", v)} options={ROOM_OPTIONS} placeholder="Any"/>

        <div>
          <Label htmlFor="area">Area (m²)</Label>
          <input
            id="area"
            type="text"
            inputMode="decimal"
            className={fieldClass}
            placeholder="Any"
            value={draft.area}
            onChange={(e) =>
              set("area", digitsOnly(e.target.value))
            }
          />
        </div>
      </div>
    </Section>
  );
}
