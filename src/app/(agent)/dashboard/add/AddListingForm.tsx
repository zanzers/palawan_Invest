"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EMPTY_DRAFT, ListingDraft, SetField } from "@/type/addTypes";
import ListingPreview from "../preview/ListingPreview";
import PropertyDetails from "@/components/dashboard/create.components/PropertyDetails";
import AddPropertyDetails from "@/components/dashboard/create.components/AddPropertyDetails";
import PropertyLocation from "@/components/dashboard/create.components/PropertyLocation";
import { useSaveListing } from "@/utils/savedListings/useSaveListing";


type Step = "form" | "preview";

export default function AddListingForm() {
    const [step, setStep] = useState<Step>("form");
    const [draft, setDraft] = useState<ListingDraft>(EMPTY_DRAFT);
    const [files, setFiles] = useState<File[]>([]);

    const set: SetField = (key, value) => setDraft((d) => ({ ...d, [key]: value }));
    
    const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)),[files]);

    const { save, saving, error: saveError, created, uploads, finished } = useSaveListing();

    useEffect(() => {
    return () => { previews.forEach((url) => URL.revokeObjectURL(url));};
    }, [previews]);

  const canPreview = Boolean(draft.title.trim() && draft.propertyType && draft.price.trim() && draft.location.trim() && draft.latitude !== null && draft.longitude !== null );

  if (step === "preview") {
    return (
      <ListingPreview
          draft={draft}
          previews={previews}
          onConfirm={() => save(draft, files)}
          onBack={() => setStep("form")}
          saving={saving}
          error={saveError}
          created={created}
          uploads={uploads}
          finished={finished}
          onCreateMore={() =>{setStep("form")}}
        />
    );
  }

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (canPreview) setStep("preview") }}>

      <PropertyDetails draft={draft} set={set} />
      <AddPropertyDetails draft={draft} set={set} files={files} previews={previews} onFilesChange={setFiles}/>
      <PropertyLocation draft={draft} set={set} />

      <div className="flex gap-3 pt-2">
        <Link href="/dashboard" className="flex-1 rounded-xl border border-slate-300 py-3 text-center text-sm font-semibold text-[#1C2216]">
          Cancel
        </Link>
        <button type="submit" disabled={!canPreview} className="flex-1 rounded-xl bg-[#1C2216] py-3 text-sm font-semibold text-white disabled:opacity-40">
          Saved
        </button>
      </div>
    </form>

  );
}