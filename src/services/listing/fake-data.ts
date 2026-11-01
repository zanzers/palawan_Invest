export type Listing = {
  id: string;
  title: string;
  location: string;
  property_type: "Condominium" | "House" | "Lot" | "Commercial";
  price: number; // PHP
  bedrooms: number | null;
};

export const LISTINGS: Listing[] = [
  { id: "L-001", title: "Studio condo near Ayala Ave", location: "Makati", property_type: "Condominium", price: 6_500_000, bedrooms: 1 },
  { id: "L-002", title: "2BR condo with city view", location: "Makati", property_type: "Condominium", price: 11_800_000, bedrooms: 2 },
  { id: "L-003", title: "Family house in a gated village", location: "Puerto Princesa", property_type: "House", price: 7_200_000, bedrooms: 3 },
  { id: "L-004", title: "Beachfront lot", location: "El Nido", property_type: "Lot", price: 15_000_000, bedrooms: null },
  { id: "L-005", title: "Commercial space on main road", location: "Puerto Princesa", property_type: "Commercial", price: 18_500_000, bedrooms: null },
  { id: "L-006", title: "1BR condo in BGC", location: "Taguig", property_type: "Condominium", price: 8_900_000, bedrooms: 1 },
];