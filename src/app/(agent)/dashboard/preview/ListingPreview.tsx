import Link from "next/link";
import type { ReactNode } from "react";
import { MapPinIcon } from "@phosphor-icons/react";
import type { ListingDraft } from "@/type/addTypes";
import { formatPrice } from "@/lib/format/format";
import { Section } from "@/components/dashboard/create.components/fields";

type Props = {
  draft: ListingDraft;
  previews: string[];
  onConfirm: () => void;
  onBack: () => void;
  saving: boolean;
  error: string | null;
  created: { id: string; code: string } | null;
};

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <dt className="shrink-0 text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-900">{children}</dd>
    </div>
  );
}

export default function ListingPreview({ draft, previews, onConfirm, onBack, saving, error, created }: Props) {
  const price = Number(draft.price.replace(/,/g, ""));

  return (
    <div className="space-y-4">
      <Section title="Check your listing">
        {previews[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previews[0]} alt="Cover" className="aspect-16/10 w-full rounded-2xl object-cover" />
        )}

        <div>
          <h2 className="text-lg font-extrabold text-slate-900">{draft.title}</h2>
          <p className="mt-1 flex items-start gap-1 text-sm text-slate-500">
            <MapPinIcon size={16} weight="fill" className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{draft.location}</span>
          </p>
        </div>

        <dl className="space-y-2">
          <Row label="Price">{formatPrice(Number.isFinite(price) ? price : null)}</Row>
          <Row label="Type">{draft.propertyType}</Row>
          {draft.bedrooms && <Row label="Bedrooms">{draft.bedrooms}</Row>}
          {draft.bathrooms && <Row label="Bathrooms">{draft.bathrooms}</Row>}
          {draft.area && <Row label="Area">{draft.area} sqm</Row>}
          <Row label="Pin">
            {draft.latitude}, {draft.longitude}
          </Row>
        </dl>

        {draft.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {draft.amenities.map((a) => (
              <span key={a} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {a}
              </span>
            ))}
          </div>
        )}

        {draft.description && <p className="whitespace-pre-wrap text-sm text-slate-600">{draft.description}</p>}

        {previews.length > 0 && !created && (
          <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
            Photos aren&apos;t uploaded yet. Saving creates the listing without them.
          </p>
        )}
      </Section>

      {error && (
        <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {created ? (
        <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
          Listing {created.code} created.{" "}
          <Link href="/dashboard" className="font-semibold underline">
            View on Home
          </Link>
        </div>
      ) : (
        <div className="flex gap-3">
          <button type="button" onClick={onBack} disabled={saving}
            className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-semibold text-[#1C2216] disabled:opacity-50">
            Back
          </button>
          <button type="button" onClick={onConfirm} disabled={saving}
            className="flex-1 rounded-xl bg-[#1C2216] py-3 text-sm font-semibold text-white disabled:opacity-50">
            {saving ? "Saving..." : "Create listing"}
          </button>
        </div>
      )}
    </div>
  );
}