type PhotoDraft = { id: string; file: File; previewUrl: string };


type unitType = {
    unit_type: string;
    price: number;
    floor_area: number | null;
    lot_area: number | null;
    specifications?: {specifications: string; value: string}[];
}


type listingType ={
    code: string;
    title: string;
    location: string;
    developer: string | null;
    units: unitType[];
}

type Filters = {
    location?: string;
    property_type?: string;
    max_price?: number;
}

type listingRow = {
  code: string;
  title: string;
  location: string;
  developers: { name: string } | null;
  property_details: (Omit<unitType, "specifications"> & {
    property_specifications?: { specification: string; value: string }[];
  })[];
};


type ListingCardData = {
  code: string;
  title: string;
  location: string;
  minPrice: number | null;
  isNew: boolean;
  imageUrl: string | null;
};

type CardViewRow = {
  code: string;
  title: string;
  location: string;
  min_price: number | string | null;
  created_at: string;
};

type ListingPropsType = { 
  title: string; 
  seeAllHref: string; 
  listings: ListingCardData[] 
};

export const Categories = [
  "rental", 
  "brokerage", 
  "project"
] as const;

export const ListingStatus = [
  "sale",
  "rent"
] as const;


export type {
  listingType,
  unitType,
  Filters,
  listingRow,
  ListingCardData,
  CardViewRow, 
  ListingPropsType,
  PhotoDraft
};