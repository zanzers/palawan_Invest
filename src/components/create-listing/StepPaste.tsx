"use client";

import Image from "next/image";
import { ImagesIcon, StarIcon, XIcon } from "@phosphor-icons/react";
import { MAX_PHOTOS } from "./useListingForm";
import type { StepProps } from "./steps";

const MAX_CHARS = 5000;

export default function StepPaste({ form }: StepProps) {
  const { draft, errors, photos, photoError, generating } = form;
  const error = errors.description;
  const ready = draft.description.trim().length >= 20;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Paste the listing</h2>
        <p className="mt-1 text-sm text-slate-500">
          Paste the details and add photos. We&apos;ll fill in the form, and you check each stage.
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Listing details
        </label>
        <textarea
          id="description"
          value={draft.description}
          onChange={(e) => form.update({ description: e.target.value })}
          disabled={generating}
          rows={8}
          maxLength={MAX_CHARS}
          placeholder="e.g. 2-bedroom condo near the airport, 54 sqm, with pool and gym. Asking ₱6.5M."
          aria-invalid={Boolean(error)}
          className={`mt-2 w-full resize-y rounded-2xl border bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 disabled:opacity-60 md:text-sm ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-slate-300 focus:border-[#1C2216] focus:ring-[#1C2216]/15"
          }`}
        />
        <div className="mt-1 flex justify-between gap-3 text-xs">
          <span role="alert" className="text-red-600">{error}</span>
          <span className="shrink-0 text-slate-400">{draft.description.length}/{MAX_CHARS}</span>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Photos <span className="font-normal normal-case tracking-normal text-slate-400">({photos.length}/{MAX_PHOTOS})</span>
        </p>

        <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:bg-slate-100 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#1C2216]">
          <ImagesIcon size={28} className="text-slate-400" aria-hidden="true" />
          <span className="text-sm font-semibold text-slate-700">Tap to add photos</span>
          <span className="text-xs text-slate-500">JPG, PNG or WebP, up to 10 MB each</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            onChange={(e) => {
              form.addPhotos(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
        </label>

        {photoError && <p role="alert" className="mt-2 text-xs text-red-600">{photoError}</p>}

        {photos.length > 0 && (
          <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {photos.map((p, i) => (
              <li key={p.id} className="relative aspect-square overflow-hidden rounded-xl bg-slate-200">
                <Image src={p.previewUrl} alt={`Photo ${i + 1}`} fill unoptimized sizes="(min-width: 640px) 25vw, 33vw" className="object-cover" />
                {i === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-[#1C2216] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => form.removePhoto(p.id)}
                  aria-label={`Remove photo ${i + 1}`}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
                >
                  <XIcon size={14} weight="bold" aria-hidden="true" />
                </button>
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => form.makeCover(p.id)}
                    aria-label={`Make photo ${i + 1} the cover`}
                    className="absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
                  >
                    <StarIcon size={14} weight="fill" aria-hidden="true" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={form.generate}
          disabled={!ready || generating}
          className="w-full rounded-full bg-[#1C2216] px-6 py-3.5 text-xs font-bold tracking-wide text-white shadow-lg transition hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {generating ? "Reading your description…" : "Generate listing"}
        </button>
        <button
          type="button"
          onClick={form.skipToManual}
          disabled={generating}
          className="w-full text-xs font-semibold text-slate-500 underline hover:text-slate-800 disabled:opacity-50"
        >
          Skip, fill in manually
        </button>
      </div>
    </div>
  );
}