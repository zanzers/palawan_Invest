"use client";

import dynamic from "next/dynamic";
import { Section, Label, fieldClass } from "./fields";
import { ListingDraft, SetField } from "@/type/addTypes";


const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-400">
      Loading map...
    </div>
  ),
});

export default function PropertyLocation({ draft, set, }: { draft: ListingDraft; set: SetField; }) {

  const pinned = draft.latitude !== null && draft.longitude !== null;

  return (
    <Section title="Property location">
      <div>
        <Label>Pin property location</Label>

        <PropertyMap 
          height="350px" 
          onPick={(p) => { 
            set("latitude", p.lat); 
            set("longitude", p.lng); 
            if(p.address) set("location", p.address)}
          }/>

        <p className={`mt-1.5 text-xs ${pinned ? "text-emerald-700" : "text-slate-500"}`}>
          {pinned ? `Pinned at ${draft.latitude}, ${draft.longitude}` : "Tap the map to drop a pin. The pin is required."}
        </p>

      </div>



      <div>
        <Label htmlFor="location">Location (shown on the listing)</Label>
        <textarea
          id="location"
          rows={2}
          className={fieldClass}
          placeholder="Tap the map and the address fills in. You can edit it."
          value={draft.location}
          onChange={(e) => set("location", e.target.value)}
        />
      </div>
    </Section>
  );
}