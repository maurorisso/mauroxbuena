"use server";

import { buildings } from "@/db/schemas/buildings";
import { fetchProperties } from "../actions";
import db from "@/db";
import { eq } from "drizzle-orm";

export const fetchPropertyById = async (id: string) => {
  const properties = await fetchProperties();
  const property = properties.find((property) => property.id === id);
  return property ?? null;
};

export const createBuilding = async (formData: FormData) => {
  const propertyId = formData.get("propertyId");
  const street = formData.get("street");
  const houseNumber = formData.get("houseNumber");
  const zipCode = formData.get("zipCode");
  const city = formData.get("city");

  const [building] = await db
    .insert(buildings)
    .values({
      propertyId: propertyId as string,
      street: street as string,
      houseNumber: houseNumber as string,
      zipCode: zipCode as string,
      city: city as string,
    })
    .returning();

  return building;
};

export const getBuildingsByPropertyId = async (propertyId: string) => {
  return await db
    .select()
    .from(buildings)
    .where(eq(buildings.propertyId, propertyId));
};
