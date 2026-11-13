export type Coordinates = { lat: number; lng: number; };
export const DEFAULT_LOCATION: Coordinates = { lat: 12.8797, lng: 121.774 };

export type PickedAddress = { address: string; city: string; province: string};
export type PickedPlace = PickedAddress & { lat: number; lng: number };

export type PropertyMapProps = { height?: string; onAddressSelect?: (address: string) => void; onPick?: (place: PickedPlace) => void};