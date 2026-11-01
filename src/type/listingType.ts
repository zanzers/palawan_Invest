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


export type {listingType, unitType, Filters, listingRow};