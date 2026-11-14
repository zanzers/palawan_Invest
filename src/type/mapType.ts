export type Coordinates = { lat: number; lng: number; };
export const DEFAULT_LOCATION: Coordinates = { lat: 12.8797, lng: 121.774 };

export type PickedAddress = { address: string; city: string; province: string};
export type PickedPlace = { lat: number; lng: number; address: string };

export type PropertyMapProps = {
  height?: string;
  onAddressSelect?: (address: string) => void;
  onPick?: (place: PickedPlace) => void;
};


export type NominatimAddress = {
  road?: string;
  pedestrian?: string;
  residential?: string;
  commercial?: string;
  neighbourhood?: string;
  quarter?: string;
  suburb?: string;
  village?: string;
  town?: string;
  city?: string;
  municipality?: string;
  state?: string;
  region?: string;
  postcode?: string;
  country?: string;
};