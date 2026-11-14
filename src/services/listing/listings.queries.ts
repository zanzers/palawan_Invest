import { cleanLocation } from "@/app/api/schema/assistant_schema";
import { toCard, toListing, withValue } from "@/lib/services/listings.service";
import { getSupabase } from "@/lib/supabase/server";
import { CardViewRow, ListingCardData, listingRow, listingType } from "@/type/listingType";


const COLUMNS = `code, title, location, developers(name)`;
const UNIT_COLUMNS = `unit_type, price, floor_area, lot_area`;
const lowestPrice = (l: listingType) => Math.min(...l.units.map((u) => u.price), Infinity);



// SEARCH LISTINGS
export async function searchListing( filters: { location?: string; property_type?: string; max_price?: number;}): Promise<listingType[]>{

    const hasUnitFilter = filters.property_type !== undefined || filters.max_price !== undefined;
    const details = `property_details${hasUnitFilter ? "!inner" : ""}(${UNIT_COLUMNS})`;


    let query = getSupabase()
        .from("listings").select(`${COLUMNS}, ${details}`)
        .eq("status", "active")
        .limit(5);
        

    query = withValue(query, filters.location && cleanLocation(filters.location), (q, v) => q.ilike("location", `%${v}%`));
    query = withValue(query, filters.property_type, (q, v) => q.ilike("property_details.unit_type", v));
    query = withValue(query, filters.max_price, (q, v) => q.lte("property_details.price", v));

    const { data, error } = await query;
    if( error ) throw new Error(`Listing search failed: ${error.message}`);
    return ((data ?? []) as unknown as listingRow[]).map(toListing).sort((a,b) => lowestPrice(a) - lowestPrice(b));
}

// GET LISTING BY CODE
export async function getListingByCode(code: string): Promise<listingType | null>{
    
    const {data, error} = await getSupabase()
        .from("listings")
        .select(`${COLUMNS}, property_details(${UNIT_COLUMNS}, property_specifications(specification, value))`)
        .eq("status", "active")
        .eq("code", code.toUpperCase())
        .maybeSingle();

    if(error) throw new Error(`Listing search failed: ${error.message}`);
    return (data as listingType | null) ?? null;
}

// GET ALL LISTING LIST
export async function listListings( filters: { q?: string; location?: string; property_type?: string; max_price?: number}, limit=10): Promise<ListingCardData[]>{

    let query = getSupabase()
        .from("listing_cards")
        .select(`code, title, location, created_at, min_price`)
        .eq("status", "active")
        .order("created_at", { ascending: false})
        .limit(limit);

    if (filters.location) query = query.ilike("location", `%${filters.location}%`);
    if (filters.property_type) query = query.contains("unit_types", [filters.property_type]);
    if (filters.max_price !== undefined) query = query.lte("min_price", filters.max_price);

    const text = filters.q?.replace(/[,()*%\\]/g, " ").trim();
    if(text) query = query.or(`title.ilike.*${text}*,location.ilike.*${text}*`);

    const { data, error} = await query;
    if(error) throw new Error(`Listing list failed: ${error.message}`);
    return ((data ?? []) as unknown as CardViewRow[]).map(toCard);

}
