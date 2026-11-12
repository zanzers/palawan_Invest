import { useState } from "react";
import { ImageIcon, PlusIcon, XIcon } from "@phosphor-icons/react";
import { fieldClass,  Label, Section } from "./fields";
import { ListingDraft, SetField } from "@/type/addTypes";


const SUGGESTED_AMENITIES = ["Pool", "Parking", "Garden", "Security", "Gym", "Balcony"];
const MAX_IMAGES = 10;

export default function AddPropertyDetails({
  draft,
  set,
  files,
  previews,
  onFilesChange,
}: {
  draft: ListingDraft;
  set: SetField;
  files: File[];
  previews: string[];
  onFilesChange: (files: File[]) => void;
}) {
  const [amenityInput, setAmenityInput] = useState("");

  const addAmenity = (name: string) => {
    const clean = name.trim();
    if (!clean || draft.amenities.some((a) => a.toLowerCase() === clean.toLowerCase())) return;
    set("amenities", [...draft.amenities, clean]);
    setAmenityInput("");
  };

  return (
    <Section title="Add property details">
      {/* Photos */}
      <div>
        <Label>Photos</Label>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 py-6 text-slate-500 hover:border-slate-300">
          <ImageIcon size={28} />
          <span className="text-sm font-medium">Upload images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              const picked = Array.from(e.target.files ?? []);
              onFilesChange([...files, ...picked].slice(0, MAX_IMAGES));
              e.target.value = "";
            }}
          />
        </label>

        {previews.length > 0 && (
          <ul className="mt-3 grid grid-cols-3 gap-2">
            {previews.map((src, i) => (
              <li key={src} className="relative aspect-square overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  aria-label={`Remove image ${i + 1}`}
                  onClick={() => onFilesChange(files.filter((_, idx) => idx !== i))}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                >
                  <XIcon size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-1.5 text-xs text-slate-400">
          Up to {MAX_IMAGES} images. The first one is the cover.
        </p>
      </div>

      {/* Amenities */}
      <div>
        <Label htmlFor="amenity">Amenities</Label>
        <div className="flex gap-2">
          <input
            id="amenity"
            className={fieldClass}
            placeholder="Add an amenity"
            value={amenityInput}
            onChange={(e) => setAmenityInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAmenity(amenityInput);
              }
            }}
          />
          <button
            type="button"
            aria-label="Add amenity"
            onClick={() => addAmenity(amenityInput)}
            className="flex w-12 shrink-0 items-center justify-center rounded-xl bg-[#1C2216] text-white"
          >
            <PlusIcon size={18} />
          </button>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {draft.amenities.map((a) => (
            <span
              key={a}
              className="flex items-center gap-1 rounded-full bg-[#1C2216] py-1 pl-3 pr-1.5 text-xs font-medium text-white"
            >
              {a}
              <button
                type="button"
                aria-label={`Remove ${a}`}
                onClick={() => set("amenities", draft.amenities.filter((x) => x !== a))}
              >
                <XIcon size={12} />
              </button>
            </span>
          ))}
          {SUGGESTED_AMENITIES.filter((s) => !draft.amenities.includes(s)).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addAmenity(s)}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <Label htmlFor="price">Price</Label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500">₱</span>
          <input
            id="price"
            inputMode="numeric"
            className={`${fieldClass} pl-8`}
            placeholder="0"
            value={draft.price}
            onChange={(e) => set("price", e.target.value.replace(/[^\d,]/g, ""))}
            required
          />
        </div>
      </div>
    </Section>
  );
}