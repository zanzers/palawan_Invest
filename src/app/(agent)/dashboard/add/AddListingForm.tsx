"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { EMPTY_DRAFT, ListingDraft, SetField } from "@/type/addTypes";
import ListingPreview from "../preview/ListingPreview";
import PropertyDetails from "@/components/dashboard/create.components/PropertyDetails";
import AddPropertyDetails from "@/components/dashboard/create.components/AddPropertyDetails";
import PropertyLocation from "@/components/dashboard/create.components/PropertyLocation";


type Step = "form" | "preview";

export default function AddListingForm() {
    const [step, setStep] = useState<Step>("form");
    const [draft, setDraft] = useState<ListingDraft>(EMPTY_DRAFT);
    const [files, setFiles] = useState<File[]>([]);

    const set: SetField = (key, value) => setDraft((d) => ({ ...d, [key]: value }));
    
    const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
    );

    useEffect(() => {
    return () => {
        previews.forEach((url) => URL.revokeObjectURL(url));
    };
    }, [previews]);
  const canPreview =
    draft.title.trim() && draft.propertyType && draft.price.trim() && draft.location;

  if (step === "preview") {
    return <ListingPreview draft={draft} set={set} />;
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (canPreview) setStep("preview");
      }}
    >
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          aria-label="Back to dashboard"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"
        >
          <ArrowLeftIcon size={20} />
        </Link>
        <h1 className="text-xl font-black text-[#1C2216]">Property information</h1>
      </div>

      <PropertyDetails draft={draft} set={set} />
      <AddPropertyDetails
        draft={draft}
        set={set}
        files={files}
        previews={previews}
        onFilesChange={setFiles}
      />
      <PropertyLocation draft={draft} set={set} />

      <div className="flex gap-3 pt-2">
        <Link
          href="/dashboard"
          className="flex-1 rounded-xl border border-slate-300 py-3 text-center text-sm font-semibold text-[#1C2216]"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={!canPreview}
          className="flex-1 rounded-xl bg-[#1C2216] py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          Preview
        </button>
      </div>
    </form>
  );
}