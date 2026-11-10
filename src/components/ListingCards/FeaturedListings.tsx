
import { listListings } from "@/services/listing/listings.queries";
import ListingSection from "./ListingSection";

export type HomeFilters = {
  q?: string;
  location?: string;
  type?: string;
  maxPrice?: string;
};

const HOME_LIMIT = 8;

export default async function FeaturedListings({
  filters,
}: {
  filters: HomeFilters;
}) {
  const maxPrice = Number(filters.maxPrice);

  const query = {
    q: filters.q,
    location: filters.location,
    property_type: filters.type,
    max_price:
      Number.isFinite(maxPrice) && maxPrice > 0
        ? maxPrice
        : undefined,
  };

  let listings;

  try {
    listings = await listListings(query, HOME_LIMIT);
  } catch (err) {
    console.error("Failed to load listings:", err);

    return (
      <p className="mt-8 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
        Couldn&apos;t load listings. Please try again.
      </p>
    );
  }

  return (
    <ListingSection
      title="Featured"
      seeAllHref="/dashboard/listings"
      listings={listings}
    />
  );
}
