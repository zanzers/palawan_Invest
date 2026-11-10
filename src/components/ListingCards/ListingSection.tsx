import Link from "next/link";
import ListingCard from "./ListingCard";
import type { ListingPropsType } from "@/type/listingType";
import WheelRow from "./WheelRow";


export default function ListingSection({ title, seeAllHref, listings }: ListingPropsType) {

  const headingId = `section-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <section aria-labelledby={headingId} className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 id={headingId} className="text-lg font-extrabold tracking-tight text-slate-900">
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
       <ul aria-label={title} className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-px-4 px-4 pb-3 pt-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
          <WheelRow label={title}>
            {listings.map((l) => (
            <li key={l.code} className="w-[78%] max-w-[18rem] shrink-0 snap-start">
              <ListingCard listing={l} />
            </li>
          ))}
          </WheelRow>
        </ul>
      )}
    </section>
  );
}