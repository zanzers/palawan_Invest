"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ListingDraft } from "@/type/addTypes";
import { getAdminToken } from "@/lib/supabase/adminSession";
import { toListingPayload } from "@/app/api/schema/toListingPayload";
import { resizeImage } from "@/utils/upload/resizeImage";

type CreatedListing = { id: string; code: string };

export type UploadStatus = "pending" | "uploading" | "done" | "failed";
export type UploadItem = { name: string; status: UploadStatus; error?: string };

export function useSaveListing() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedListing | null>(null);
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const change = (index: number, patch: Partial<UploadItem>) =>
    setUploads((list) => list.map((u, i) => (i === index ? { ...u, ...patch } : u)));

  async function uploadOne(listingId: string, file: File, position: number, token: string) {
    const small = await resizeImage(file);

    const body = new FormData();
    body.append("files", small);
    body.append("position", String(position));

    const res = await fetch(`/api/listings/${listingId}/images`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? "Upload failed");
  }

  // One photo at a time, so the progress is exact and one failure doesn't stop the rest
  async function uploadAll(listingId: string, files: File[], token: string) {
    if (uploads.length !== files.length) {
      setUploads(files.map((f) => ({ name: f.name, status: "pending" })));
    }

    let failed = 0;
    for (let i = 0; i < files.length; i++) {
      if (uploads[i]?.status === "done") continue; // a retry skips what already went through

      change(i, { status: "uploading", error: undefined });
      try {
        await uploadOne(listingId, files[i], i, token);
        change(i, { status: "done" });
      } catch (err) {
        failed += 1;
        change(i, { status: "failed", error: err instanceof Error ? err.message : "Upload failed" });
      }
    }

    if (failed > 0) {
      setError(`${failed} photo${failed > 1 ? "s" : ""} didn't upload. The listing is saved, so you can retry.`);
    }
  }

  async function save(draft: ListingDraft, files: File[]) {
    if (saving) return;

    setSaving(true);
    setError(null);

    try {
      const token = await getAdminToken();
      if (!token) {
        router.push("/auth/login");
        return;
      }

      let listing = created;

      if (!listing) {
        const res = await fetch("/listings", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(toListingPayload({ ...draft, area: String(draft.area ?? "") })),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(
            res.status === 403
              ? "This account isn't allowed to create listings."
              : (data.issues?.join(". ") ?? data.error ?? "Could not save the listing"),
          );
        }

        listing = data as CreatedListing;
        setCreated(listing);
      }

      await uploadAll(listing.id, files, token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  // Finished = the listing exists and every photo went through (with no photos, that is true right away)
  const finished = created !== null && !saving && uploads.every((u) => u.status === "done");

  return { save, saving, error, created, uploads, finished };
}