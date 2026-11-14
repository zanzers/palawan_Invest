import { getProvinceFromPostalCode } from "@/lib/postalCode/philippinePostalCodes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json(
      { error: "Invalid coordinates" },
      { status: 400 }
    );
  }

  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");

    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lng));

    const response = await fetch(url, {
      headers: {
        "User-Agent": "PropertyListingApp/1.0 (nowellsaavedra999@gmail.com)",
        "Accept-Language": "en",
      },
      cache: "no-store",
    });

    

    if (!response.ok) {
      const errorDetails = await response.text();

      return NextResponse.json(
        {
          error: "Nominatim rejected the request",
          details: errorDetails,
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    const postcode = data?.address?.postcode ?? "";
    const province = postcode ? (getProvinceFromPostalCode(postcode) ?? ""): "";

    const displayName: string = postcode && province && data.display_name ? data.display_name.replace(postcode, province) : (data.display_name ?? "");
    if (process.env.NODE_ENV !== "production") console.log("Reverse geocode:", displayName);


    // console.log(
    //   "API RESPONSE:", 
    //   data,
    //   data.lat,
    //   data.lon,
    //   displayName
    // );


    return NextResponse.json({
      lat: Number(data.lat),
      lon: Number(data.lon),
      display_name: displayName,
      address: data.address,
    });

  } catch (error) {
    console.error("Reverse geocoding error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve address" },
      { status: 500 }
    );
  }
}