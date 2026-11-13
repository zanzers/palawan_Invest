const POSTAL_CODE_LOOKUP: Record<string, { province: string; city: string; region: string }> = {
  "5300": {
    province: "Palawan",
    city: "Puerto Princesa",
    region: "Mimaropa",
  },
};

export function getProvinceFromPostalCode(
  postalCode: string
): string {
  return POSTAL_CODE_LOOKUP[postalCode]?.province ?? "";
}