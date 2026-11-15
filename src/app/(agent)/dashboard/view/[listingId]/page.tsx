import { notFound } from "next/navigation";

import { getListingById } from "@/services/listing/listings.queries";
import ListingImageGallery from "@/components/ListingDetails/ListingImageGallery.comp";
import PropertyInfo from "@/components/ListingDetails/PropertyInfo";

export default async function ListingDetailsPage({params}: {params: Promise<{ listingId: string }>}) {
    
    const { listingId } = await params;
    const listing = await getListingById(listingId);

    if (!listing) notFound();

    return (
        <main>
        <ListingImageGallery
            images={listing.images}
            title={listing.title}
        />

        <PropertyInfo
            title={listing.title}
            description={listing.description}
            price={listing.property_details[0]?.price ?? null}
            location={listing.property_details[0]?.location ?? null}
        />
        </main>
    );
}