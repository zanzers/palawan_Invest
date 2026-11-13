
"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup,} from "react-leaflet";
import { getAddressFromCoordinates } from "@/lib/map/getAddress";
import { MapCenter, MapClickHandler, MapControls } from "@/lib/map/propertyMap.lib";
import { Coordinates, DEFAULT_LOCATION, PropertyMapProps } from "@/type/mapType";


export default function PropertyMap({ height = "350px", onAddressSelect }: PropertyMapProps) {

  const [agentLocation, setAgentLocation] = useState<Coordinates | null>(null);
  const [position, setPosition] = useState<Coordinates | null>(null);
  const [locationStatus, setLocationStatus] = useState("Locating your position...");



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
        setLocationStatus("Location unavailable. You can still select on the map.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );

  }, []);
  
  console.log("Your Locations cannot find,", locationStatus);

  const handleSelect = async (coordinates: Coordinates) => {
    setPosition(coordinates);

    console.log("Selected property coordinates:", coordinates);

    const address = await getAddressFromCoordinates( coordinates.lat, coordinates.lng);

    if (!address) {
      console.error("Unable to retrieve address.");
      return;
    }

  console.log("Complete address:", address.fullAddress);
  console.log("Address details:", address);

  onAddressSelect?.(address.fullAddress);

  };

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-xl border border-slate-200" style={{ height }}>
        <MapContainer center={[  DEFAULT_LOCATION.lat,  DEFAULT_LOCATION.lng,]} zoom={6} scrollWheelZoom className="h-full w-full z-0">

          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

          <MapCenter location={agentLocation} />

          <MapClickHandler onSelect={handleSelect} />


          {agentLocation && (
            <CircleMarker
              center={[ agentLocation.lat, agentLocation.lng ]}
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
      

        {/* Agent location finder */}
      {/* <p className="text-xs text-slate-500">
        {locationStatus}
      </p> */}


    </div>
  );
}






