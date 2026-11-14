import Link from "next/link";
import type { ReactNode } from "react";
import {
  CheckCircleIcon,
  CircleNotchIcon,
  ClockIcon,
  MapPinIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import type { ListingDraft } from "@/type/addTypes";
import type { UploadItem } from "@/utils/savedListings/useSaveListing";
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
  uploads: UploadItem[];
  finished: boolean;
  onCreateMore: () => void;
};

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <dt className="shrink-0 text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-900">{children}</dd>
    </div>
  );
}

function StatusLabel({ status }: { status: UploadItem["status"] }) {
  if (status === "uploading") {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-[#1C2216]">
        <CircleNotchIcon size={16} className="animate-spin" aria-hidden="true" /> Uploading
      </span>
    );
  }
  if (status === "done") {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-emerald-700">
        <CheckCircleIcon size={16} weight="fill" aria-hidden="true" /> Done
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-red-600">
        <WarningCircleIcon size={16} weight="fill" aria-hidden="true" /> Failed
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs text-slate-400">
      <ClockIcon size={16} aria-hidden="true" /> Waiting
    </span>
  );
}

export default function ListingPreview({
  draft,
  previews,
  onConfirm,
  onBack,
  saving,
  error,
  created,
  uploads,
  finished,
  onCreateMore
}: Props) {
  const price = Number(draft.price.replace(/,/g, ""));

  const total = uploads.length;
  const done = uploads.filter((u) => u.status === "done").length;
  const current = uploads.findIndex((u) => u.status === "uploading");

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
            {previews.length} photo{previews.length > 1 ? "s" : ""} will be uploaded when you create the listing.
          </p>
        )}
      </Section>

      {error && (
        <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {created && (
        <Section title={finished ? `Listing ${created.code} created` : `Listing ${created.code} saved`}>
          {total > 0 && (
            <>
              <p aria-live="polite" className="text-sm font-medium text-slate-700">
                {saving
                  ? `Uploading photo ${current >= 0 ? current + 1 : Math.min(done + 1, total)} of ${total}…`
                  : finished
                    ? `All ${total} photo${total > 1 ? "s" : ""} uploaded`
                    : `${done} of ${total} photos uploaded`}
              </p>

              <div
                role="progressbar"
                aria-label="Photo upload progress"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={done}
                className="h-2 overflow-hidden rounded-full bg-slate-200"
              >
                <div
                  className="h-full rounded-full bg-[#1C2216] transition-all duration-300"
                  style={{ width: `${(done / total) * 100}%` }}
                />
              </div>

              <ul className="space-y-2">
                {uploads.map((u, i) => (
                  <li key={`${u.name}-${i}`} className="flex items-center gap-3">
                    {previews[i] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={previews[i]} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                    )}
                    <span className="min-w-0 flex-1 truncate text-sm text-slate-700">{u.name}</span>
                    <StatusLabel status={u.status} />
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* SUCCESS DIALOG */}
          {finished && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
                <div className="mb-4 text-4xl">✓</div>

                <h2 className="text-xl font-bold text-[#1C2216]">
                  Listing Saved!
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Your listing has been successfully saved.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href="/dashboard"
                    className="w-full rounded-xl bg-[#1C2216] py-3 text-sm font-semibold text-white"
                  >
                    Home
                  </Link>

                  <button
                    type="button"
                    onClick={onCreateMore}
                    className="w-full rounded-xl border border-[#1C2216] py-3 text-sm font-semibold text-[#1C2216]"
                  >
                    Create More
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FAILURE DIALOG */}
          {created && !finished && !saving && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
                <div className="mb-4 text-4xl">!</div>

                <h2 className="text-xl font-bold text-red-600">
                  Failed
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Your listing was saved, but the photos could not be uploaded.
                </p>

                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={saving}
                  className="mt-6 w-full rounded-xl bg-[#1C2216] py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {saving ? "Retrying..." : "Retry"}
                </button>
              </div>
            </div>
          )}
        </Section>
      )}

      {!created && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={saving}
            className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-semibold text-[#1C2216] disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="flex-1 rounded-xl bg-[#1C2216] py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create listing"}
          </button>
        </div>
      )}
    </div>
  );
}