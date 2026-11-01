import {listingType, listingRow } from "@/type/listingType";

export function withValue<Q, V>( query: Q, value: V | null | undefined, apply: (q: Q, v: V) => Q ): Q {
    return value === undefined || value === null || value === "" ? query : apply(query, value);
}

export function toListing(row: listingRow): listingType{
    return {
        code: row.code,
        title: row.title,
        location: row.location,
        developer: row.developers?.name ?? null,
        units: (row.property_details ?? []).map((u) => ({
            unit_type: u.unit_type,
            price: u.price,
            floor_area: u.floor_area,
            lot_area: u.lot_area,
            ...(u.property_specifications && {
                specifications: u.property_specifications.map(({ specification, value }) => ({
                    specifications: specification,
                    value,
                })),
            }),
        })),
    }
}
