import { formatPhilippineAddress } from "@/utils/address/formatPhilippineAddress";

export async function getAddressFromCoordinates(lat: number, lng: number) {
  try {
    const params = new URLSearchParams({ lat: String(lat), lng: String(lng),});
    const response = await fetch(`/api/reverse-geocode?${params}`);
    const data = await response.json();


    if (!response.ok) throw new Error(data.error || "Address lookup failed");

    const fullAddress = formatPhilippineAddress(data.address ?? {});

    
    console.log("Full Address:",fullAddress);

    return {
        lat: data.lat,
        lon: data.lon,
        fullAddress,
    };
    
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}