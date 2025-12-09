"use server";
import db from "@/db";
import { properties } from "@/db/schemas/properties";
import { users, type User } from "@/db/schemas/users";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
export const fetchProperties = async () => {
  const propertiesData = await db.select().from(properties);
  return propertiesData;
};

export const fetchManagersAndAccountants = async (): Promise<{
  managers: User[];
  accountants: User[];
}> => {
  const staff = await db
    .select()
    .from(users)
    .where(inArray(users.role, ["manager", "accountant"]));

  return {
    managers: staff.filter((user) => user.role === "manager"),
    accountants: staff.filter((user) => user.role === "accountant"),
  };
};

export const createProperty = async (formData: FormData): Promise<void> => {
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
    throw new Error("Failed to create property");
  }
};

export const getUserNameById = async (id: string): Promise<string> => {
  const user = await db.select().from(users).where(eq(users.id, id));
  return user?.[0]?.name ?? "Unknown";
};
