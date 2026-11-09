import Image from "next/image";
import { ImageSquareIcon, MapPinIcon } from "@phosphor-icons/react/dist/ssr";
import type { ListingCardData } from "@/type/listingType";
import { formatPrice } from "@/lib/format/format";

export default function ListingCard({ listing }: { listing: ListingCardData }) {
  return (
    <article className="overflow-hidden">

      <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl">
        {listing.imageUrl ? (
          <Image src={listing.imageUrl} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover"/>
            ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-200 to-slate-300 text-slate-400">
                <ImageSquareIcon size={40} weight="light" aria-hidden="true" />
            </div>
        )}

        {listing.isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-[#1C2216] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
            New
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-base font-bold text-slate-900">{listing.title}</h3>
          <p className="shrink-0 text-base font-extrabold text-[#1C2216]">{formatPrice(listing.minPrice)}</p>
        </div>

        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
          <MapPinIcon size={16} weight="fill" aria-hidden="true" className="shrink-0" />
          <span className="truncate">{listing.location}</span>
        </p>
      </div>
    </article>
  );
}