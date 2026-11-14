"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ListingDraft } from "@/type/addTypes";
import { getAdminToken } from "@/lib/supabase/adminSession";
import { toListingPayload } from "@/app/api/schema/toListingPayload";



export function useSaveListing() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ id: string; code: string } | null>(null);

  async function save(draft: ListingDraft) {
    if (saving || created) return;
    setSaving(true);
    setError(null);

    try {
      const token = await getAdminToken();
      if (!token) {
        router.push("/auth/login");
        return;
      }

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
      setCreated(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return { save, saving, error, created };
}