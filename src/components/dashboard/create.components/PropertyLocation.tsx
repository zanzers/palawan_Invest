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

export default function PropertyLocation({ draft, set, }: { draft: ListingDraft;set: SetField; }) {
  return (
    <Section title="Property location">
      <div>
        <Label>Pin property location</Label>
        <PropertyMap height="350px" onAddressSelect={(address) => set("address", address)}/>

        <Label htmlFor="address">Street address</Label>

        <input id="address" className={fieldClass} placeholder="Street, barangay, city" value={draft.address} onChange={(e) => set("address", e.target.value)}/>
      </div>

      <div>
       
      </div>
    </Section>
  );
}