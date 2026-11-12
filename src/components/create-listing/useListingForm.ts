import { toPayload, validateStep } from "@/api/schema/payload.schema";
import { FieldErrors, ListingDraft, StepId, UnitDraft } from "@/type/addListing.Type";
import { createEmptyDraft, newUnit, uid } from "@/type/draftDefaults.type";
import { PhotoDraft } from "@/type/listingType";
import { useEffect, useRef, useState } from "react";
import { analyzeListing, FAILURE_MESSAGES } from "./analyzeListing";


const LAST_STEP: StepId = 4;
export const MAX_PHOTOS = 10;
const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export function useListingForm() {
  const [draft, setDraft] = useState<ListingDraft>(createEmptyDraft);
  const [step, setStep] = useState<StepId>(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [finished, setFinished] = useState(false);

  const [photos, setPhotos] = useState<PhotoDraft[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [generating, setGenerating] = useState(false);
  const [aiFilled, setAiFilled] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Preview URLs hold memory, so release them when the wizard goes away
  const photosRef = useRef<PhotoDraft[]>([]);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl)), []);

  function update(patch: Partial<ListingDraft>) {
    setDraft((d) => {
      const next = { ...d, ...patch };
      // Only projects can have several units
      if (patch.category !== undefined && next.category !== "project" && next.units.length > 1) {
        next.units = next.units.slice(0, 1);
      }
      return next;
    });
  }

  function updateUnit(index: number, patch: Partial<UnitDraft>) {
    setDraft((d) => ({ ...d, units: d.units.map((u, i) => (i === index ? { ...u, ...patch } : u)) }));
  }

  function addUnit() {
    setDraft((d) => (d.category === "project" ? { ...d, units: [...d.units, newUnit()] } : d));
  }

  function removeUnit(index: number) {
    setDraft((d) => (d.units.length > 1 ? { ...d, units: d.units.filter((_, i) => i !== index) } : d));
  }

  function addPhotos(files: File[]) {
    const problems: string[] = [];
    const accepted: PhotoDraft[] = [];
    const room = MAX_PHOTOS - photos.length;

    for (const file of files) {
      if (!ACCEPTED.includes(file.type)) {
        problems.push(`${file.name}: use JPG, PNG or WebP`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        problems.push(`${file.name}: larger than 10 MB`);
        continue;
      }
      if (accepted.length >= room) {
        problems.push(`Up to ${MAX_PHOTOS} photos`);
        break;
      }
      accepted.push({ id: uid(), file, previewUrl: URL.createObjectURL(file) });
    }

    setPhotoError(problems.length ? problems.join(". ") : null);
    if (accepted.length) setPhotos((p) => [...p, ...accepted]);
  }

  function removePhoto(id: string) {
    setPhotoError(null);
    setPhotos((list) => {
      const gone = list.find((p) => p.id === id);
      if (gone) URL.revokeObjectURL(gone.previewUrl);
      return list.filter((p) => p.id !== id);
    });
  }

  // The first photo is the cover
  function makeCover(id: string) {
    setPhotos((list) => {
      const picked = list.find((p) => p.id === id);
      return picked ? [picked, ...list.filter((p) => p.id !== id)] : list;
    });
  }

  function next() {
    const found = validateStep(step, draft);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setDirection("forward");
    if (step === LAST_STEP) setFinished(true);
    else setStep((s) => (s + 1) as StepId);
  }

  
  async function generate() {
  if (generating) return;

  if (draft.description.trim().length < 20) {
    setErrors({ description: "Paste at least 20 characters, or skip to fill in manually." });
    return;
  }

  setErrors({});
  setNotice(null);
  setGenerating(true);

  const result = await analyzeListing(draft.description.trim());

    setGenerating(false);
    if (result.ok) {
      update(result.draft);
      setAiFilled(true);
    } else {
      setAiFilled(false);
      setNotice(FAILURE_MESSAGES[result.reason]);
    }
    setDirection("forward");
    setStep(2);
  }

  function skipToManual() {
    setErrors({});
    setNotice(null);
    setAiFilled(false);
    setDirection("forward");
    setStep(2);
  }

  function back() {
    setErrors({});
    setDirection("back");
    if (finished) setFinished(false);
    else setStep((s) => (s > 1 ? ((s - 1) as StepId) : s));
  }

  // The progress indicator only lets you jump back to stages you already passed
  function goTo(target: StepId) {
    if (!finished && target >= step) return;
    setErrors({});
    setDirection("back");
    setFinished(false);
    setStep(target);
  }

  const payload = finished ? toPayload(draft) : null;

  return {
  draft, step, direction, errors, finished, payload,
  photos, photoError,
  generating, aiFilled, notice,
  update, updateUnit, addUnit, removeUnit,
  addPhotos, removePhoto, makeCover,
  generate, skipToManual,
  next, back, goTo,
};
}

export type ListingForm = ReturnType<typeof useListingForm>;