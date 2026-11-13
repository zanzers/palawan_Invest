
export async function getAddressFromCoordinates(lat: number, lng: number) {
  try {
    const params = new URLSearchParams({ lat: String(lat), lng: String(lng),});
    const response = await fetch(`/api/reverse-geocode?${params}`);
    const data = await response.json();


    if (!response.ok) throw new Error(data.error || "Address lookup failed");
    

    return {
        lat: data.lat,
        lon: data.lon,
        fullAddress: data.display_name,
    };
    
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}