import { NominatimAddress } from "@/type/mapType";
import { getProvinceFromPostalCode } from "@/lib/postalCode/philippinePostalCodes";

export function formatPhilippineAddress( address: NominatimAddress ): string {

    const province = address.state || getProvinceFromPostalCode(address.postcode || "");
    const city = address.city || address.town || address.municipality;
    const locality = [ address.road, address.pedestrian, address.residential, address.commercial, address.neighbourhood, address.quarter, address.suburb ? `Barangay:${address.suburb}` : null ];
    const parts = [...locality, city, province];



    return [ ...new Set( parts.filter((part): part is string => Boolean(part?.trim())).map((part) => part.trim())),].join(", ");
}