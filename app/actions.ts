import db from "@/db";
import { properties } from "@/db/schemas/properties";
export const fetchProperties = async () => {
  const propertiesData = await db.select().from(properties);
  return propertiesData;
};
