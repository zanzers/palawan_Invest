import Link from "next/link";
import ListingCard from "./ListingCard";
import type { ListingCardData } from "@/type/listingType";

type Props = { title: string; seeAllHref: string; listings: ListingCardData[] };

export default function ListingSection({ title, seeAllHref, listings }: Props) {
  return (
    <section aria-labelledby="listing-section-title" className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="listing-section-title" className="text-lg font-extrabold tracking-tight text-slate-900">
          {title}
        </h2>
        <Link href={seeAllHref} className="text-xs font-semibold text-slate-500 hover:text-slate-900">
          See all
        </Link>
      </div>

      {listings.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          No listings match your search.
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {listings.map((l) => (
            <li key={l.code}>
              <ListingCard listing={l} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}