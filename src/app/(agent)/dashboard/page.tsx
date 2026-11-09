import { Suspense } from "react";
import DashboardHeader from "./DashboardHeader";
import SearchBar from "@/components/dashboard/SearchBar";

import { LOCATIONS, PROPERTY_TYPES } from "@/app/config/filterOptions";
import ListingSkeleton from "@/components/ListingCards/ListingSkeleton";
import FeaturedListings from "@/components/ListingCards/FeaturedListings";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function DashboardHome({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const filters = {
    q: first(sp.q),
    location: first(sp.location),
    type: first(sp.type),
    maxPrice: first(sp.max_price),
  };

  return (
    <>
      <DashboardHeader unreadMessages={0} unreadNotifications={0} />

      <main className="mx-auto max-w-3xl px-4 pt-4">
        <Suspense fallback={<div className="h-12" />}>
          <SearchBar locations={LOCATIONS} types={PROPERTY_TYPES} />
        </Suspense>

        {/* key makes the skeleton show again whenever the filters change */}
        <Suspense key={JSON.stringify(filters)} fallback={<ListingSkeleton />}>
          <FeaturedListings filters={filters} />
        </Suspense>
      </main>
    </>
  );
}