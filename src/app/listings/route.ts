import { authenticate } from "@/lib/auth/authenticate";
import { listingFiltersSchema } from "@/app/api/schema/assistant_schema";
import { searchListing } from "@/services/listing/listings.queries";
import { NextResponse } from "next/server";
import { createListingSchema } from "../api/schema/creatingListing.schema";


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


export async function POST(req: Request){

    const auth = await authenticate(req);
    
    if("response" in auth) return auth.response;

    const parsed = createListingSchema.safeParse(await req.json().catch(() => null));
    
    if(!parsed.success) return NextResponse.json( {error: "Invalid listing", issues: parsed.error.issues.map((i) => `${i.path.join(".")} : ${i.message}`)}, {status: 400});

    const { data, error } = await auth.db.rpc("create_listing", {payload: parsed.data});

    console.log("Listing payload: ", parsed.data);

    if (error) {
  console.error("create_listing failed:", error);

  if (error.code === "42501") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }
  if (error.code === "22023") {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ error: "Could not save the listing" }, { status: 500 });
}

    return NextResponse.json(data, {status: 201});

    


}