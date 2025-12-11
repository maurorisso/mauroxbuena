export type N8nWebhookData = Array<{
  property: {
    name: string;
    type: "WEG" | "MV";
    propertyId?: string;
  };
  buildings: Array<{
    street: string;
    houseNumber: string;
    zipCode: string;
    city: string;
    units: Array<{
      unitNumber: string;
      type: "Apartment" | "Office" | "Garden" | "Parking";
      floor: number | null;
      entrance: string | null;
      size: number;
      rooms: number | null;
      coOwnershipShare: number | null;
      coOwnershipShareRaw?: string;
      constructionYear: number | null;
    }>;
  }>;
  propertyId?: string;
}>;
