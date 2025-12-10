"use server";

import { buildings } from "@/db/schemas/buildings";
import db from "@/db";
import { eq } from "drizzle-orm";
import { units } from "@/db/schemas/units";
import { properties } from "@/db/schemas/properties";

export const fetchPropertyById = async (id: string) => {
  const [property] = await db
    .select()
    .from(properties)
    .where(eq(properties.id, id));
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

export const getUnitsByBuildingId = async (buildingId: string) => {
  return await db.select().from(units).where(eq(units.buildingId, buildingId));
};

export const fetchUnits = async () => {
  return await db.select().from(units);
};

export const createUnit = async (formData: FormData) => {
  const buildingId = formData.get("buildingId");
  const unitNumber = formData.get("unitNumber");
  const type = formData.get("type");
  const floor = formData.get("floor");
  const entrance = formData.get("entrance");
  const size = formData.get("size");
  const coOwnershipShare = formData.get("coOwnershipShare");
  const rooms = formData.get("rooms");
  const constructionYear = formData.get("constructionYear");

  const [unit] = await db
    .insert(units)
    .values({
      buildingId: buildingId as string,
      unitNumber: unitNumber as string,
      type: type as "Apartment" | "Office" | "Garden" | "Parking",
      floor: floor ? parseInt(floor as string) : null,
      entrance: entrance ? (entrance as string) : null,
      size: size as string,
      coOwnershipShare: coOwnershipShare ? (coOwnershipShare as string) : null,
      rooms: rooms ? (rooms as string) : null,
      constructionYear: constructionYear
        ? parseInt(constructionYear as string)
        : null,
    })
    .returning();

  return unit;
};
