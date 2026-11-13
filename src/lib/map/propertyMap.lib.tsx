import { Coordinates } from "@/type/mapType";
import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";

interface MapClickHandlerProps {
  onSelect: (coordinates: Coordinates) => void;
}

interface MapControlsProps { agentLocation: Coordinates | null;}
interface MapCenterProps { location: Coordinates | null; }


const DEFAULT_ZOOM = 16;
const FLY_DURATION = 1;


export function MapClickHandler({ onSelect }: MapClickHandlerProps) {
  useMapEvents({
    click: ({ latlng }) => {
      onSelect({
        lat: Number(latlng.lat.toFixed(6)),
        lng: Number(latlng.lng.toFixed(6)),
      });
    },
  });

  return null;
}


export function MapControls({ agentLocation }: MapControlsProps) {
  const map = useMap();

  const goToMyLocation = () => {
    if (!agentLocation) return;

    map.flyTo(
      [agentLocation.lat, agentLocation.lng],
      DEFAULT_ZOOM,
      { duration: FLY_DURATION }
    );
  };

  return (
    <button type="button" onClick={goToMyLocation} disabled={!agentLocation} className="absolute bottom-4 right-4 z-1000 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-md hover:bg-slate-50 disabled:opacity-50" title="My location" aria-label="Go to my location">
      <span className="text-lg">◎</span>
    </button>
  );
}


export function MapCenter({ location }: MapCenterProps) {
  const map = useMap();

  useEffect(() => {
    if (!location) return;

    map.flyTo(
      [location.lat, location.lng],
      DEFAULT_ZOOM,
      { duration: FLY_DURATION }
    );
  }, [location, map]);

  return null;
}