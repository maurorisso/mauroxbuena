"use server";
import db from "@/db";
import { properties } from "@/db/schemas/properties";
import { revalidatePath } from "next/cache";
export const fetchProperties = async () => {
  const propertiesData = await db.select().from(properties);
  return propertiesData;
};

export const createProperty = async (
  formData: FormData
): Promise<void | { error: string }> => {
  console.log("Creating property", formData);
  try {
    const managerId = formData.get("propertyManager");
    const accountantId = formData.get("accountant");
    const declarationUrl = "Mocked for now";
    const propertyName = formData.get("propertyName") as string;
    const propertyType = formData.get("type") as "WEG" | "MV";
    //const declaration = formData.get("divisionDeclaration");

    await db.insert(properties).values({
      name: propertyName,
      type: propertyType,
      managerId: managerId ? String(managerId) : null,
      accountantId: accountantId ? String(accountantId) : null,
      declarationUrl,
    });

    revalidatePath("/");
  } catch (error) {
    console.error("Error creating property", error);
    return { error: "Failed to create property" };
  }
};
