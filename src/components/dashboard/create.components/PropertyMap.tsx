
"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { getProvinceFromPostalCode } from "@/lib/postalCode/philippinePostalCodes";

type Coordinates = {
  lat: number;
  lng: number;
};

type PropertyMapProps = {
  height?: string;
  onAddressSelect?: (address: string) => void;
};


const DEFAULT_LOCATION: Coordinates = {
  lat: 12.8797,
  lng: 121.774,
};

function MapClickHandler({
  onSelect,
}: {
  onSelect: (coordinates: Coordinates) => void;
}) {
  useMapEvents({
    click(e) {
      onSelect({
        lat: Number(e.latlng.lat.toFixed(6)),
        lng: Number(e.latlng.lng.toFixed(6)),
      });
    },
  });

  return null;
}



function MapControls({
  agentLocation,
}: {
  agentLocation: Coordinates | null;
}) {
  const map = useMap();

  const goToMyLocation = () => {
    if (!agentLocation) return;

    map.flyTo(
      [agentLocation.lat, agentLocation.lng],
      16,
      { duration: 1 }
    );
  };

  return (
    <button
      type="button"
      onClick={goToMyLocation}
      disabled={!agentLocation}
      className="absolute bottom-4 right-4 z-[1000] flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      title="My location"
    >
      <span className="text-lg">◎</span>
    </button>
  );
}

function MapCenter({
  location,
}: {
  location: Coordinates | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo(
        [location.lat, location.lng],
        16,
        { duration: 1 }
      );
    }
  }, [location, map]);

  return null;
}

export default function PropertyMap({
  height = "350px",
  onAddressSelect,
}: PropertyMapProps) {
  const [agentLocation, setAgentLocation] =
    useState<Coordinates | null>(null);

  const [position, setPosition] =
    useState<Coordinates | null>(null);

  const [locationStatus, setLocationStatus] =
    useState("Locating your position...");

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = {
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
        };

        setAgentLocation(coordinates);
        setLocationStatus("Your location detected");
        
        console.log("Agent location:", coordinates);
      },
      () => {
        setLocationStatus(
          "Location unavailable. You can still select on the map."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

const handleSelect = async (coordinates: Coordinates) => {
  setPosition(coordinates);

  console.log("Selected property coordinates:", coordinates);

  const address = await getAddressFromCoordinates(
    coordinates.lat,
    coordinates.lng
  );

  console.log("Address to input:", address);
  console.log("Address to postcode:", address.postcode);

  onAddressSelect?.(address || "");

};

  return (
    <div className="space-y-3">
      <div
        className="relative overflow-hidden rounded-xl border border-slate-200"
        style={{ height }}
      >
        <MapContainer
          center={[
            DEFAULT_LOCATION.lat,
            DEFAULT_LOCATION.lng,
          ]}
          zoom={6}
          scrollWheelZoom
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapCenter location={agentLocation} />

          <MapClickHandler onSelect={handleSelect} />

          {/* Agent's current location */}
          {agentLocation && (
            <CircleMarker
              center={[
                agentLocation.lat,
                agentLocation.lng,
              ]}
              radius={7}
              pathOptions={{
                color: "#ffffff",
                fillColor: "#3B82F6",
                fillOpacity: 1,
                weight: 3,
              }}
            >
              <Popup>The agent&apos;s location</Popup>
            </CircleMarker>
          )}

          {/* Selected property location */}
          {position && (
            <CircleMarker
              center={[position.lat, position.lng]}
              radius={9}
              pathOptions={{
                color: "#ffffff",
                fillColor: "#273322",
                fillOpacity: 1,
                weight: 3,
              }}
            >
              <Popup>
                <strong>Selected property location</strong>
                <br />
                {position.lat}, {position.lng}
              </Popup>
            </CircleMarker>
          )}

          <MapControls agentLocation={agentLocation} />
        </MapContainer>
      </div>

      <p className="text-xs text-slate-500">
        {locationStatus}
      </p>

      {position && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="mb-1 text-xs font-medium text-slate-700">
            Selected property coordinates
          </p>

          <p className="text-sm text-slate-600">
            Latitude: {position.lat}
          </p>

          <p className="text-sm text-slate-600">
            Longitude: {position.lng}
          </p>
        </div>
      )}
    </div>
  );
}







async function getAddressFromCoordinates(
  lat: number,
  lng: number
) {
  try {
    const response = await fetch(
      `/api/reverse-geocode?lat=${lat}&lng=${lng}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Address lookup failed");
    }

    console.log("========== REVERSE GEOCODING ==========");
    console.log("Full response:", data);
    console.log("Property address:", data.address);
    console.log("Address details:", data.details);
    console.log("Street:", data.details?.road ?? "Not available");
    console.log("Barangay:", data.details?.suburb ?? "Not available");
    console.log("City:", data.details?.city ?? "Not available");
    const province = getProvinceFromPostalCode(data.details.postcode || "");
    console.log("Province:", province || "Not available");
    console.log("Region:", data.details?.region ?? "Not available");
    console.log("Postal code:", data.details?.postcode ?? "Not available");
    console.log("Country:", data.details?.country ?? "Not available");
    
    console.log("========================================");

    return data.address ?? null;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}