import { listingFiltersSchema } from "@/api/schema/assistant_schema";
import { searchListing } from "@/services/listing/listings";
import { NextResponse } from "next/server";


export async function GET(req: Request){

    const sp = new URL(req.url).searchParams;

    const parsed = listingFiltersSchema.safeParse({
        location: sp.get("location") ?? undefined,
        property_type: sp.get("type") ?? undefined,
        max_price: sp.get("max_price") ?? undefined,
    });

    if(!parsed.success){
        return NextResponse.json(
            {error: "Invalid search filters"},
            {status: 400 }
        );
    }

    try{
        const listings = await searchListing(parsed.data);
        return NextResponse.json({ total: listings.length, listings: listings.slice(0,10) });
    } catch (err){
        console.error("Direct listing search failed:", err);
        return NextResponse.json({ error: "Search failed"}, {status: 500});
    }
}