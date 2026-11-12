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
    const url = new URL(
      "https://nominatim.openstreetmap.org/reverse"
    );

    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lng));

    const response = await fetch(url, {
      headers: {
        "User-Agent": "PropertyListingApp/1.0 (your-real-email@gmail.com)",
        "Accept-Language": "en",
      },
      cache: "no-store",
    });

    const responseText = await response.text();

    if (!response.ok) {
      const errorDetails = await response.text();

      console.error("NOMINATIM STATUS:", response.status);
      console.error("NOMINATIM RESPONSE:", errorDetails);

      return NextResponse.json(
        {
          error: "Nominatim rejected the request",
          status: response.status,
          details: errorDetails,
        },
        { status: 502 }
      );
    }
    const data = JSON.parse(responseText);

    console.log("FULL API RESPONSE:", data);
    console.log("ALL AVAILABLE ADDRESS FIELDS:", data.details);

    console.log("ALL AVAILABLE ADDRESS FIELDS:", data.details);

    return NextResponse.json({
      address: [
        data.address?.road || data.address?.pedestrian || data.address?.residential,
        data.address?.suburb || data.address?.village,
        data.address?.city || data.address?.town || data.address?.municipality,
        data.address?.province || "Palawan",
        data.address?.region,
        data.address?.country,
      ]
        .filter(Boolean)
        .join(", "),
      details: data.address ?? null,
    });
  } catch (error) {
    console.error("Reverse geocoding error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve address" },
      { status: 500 }
    );
  }
}