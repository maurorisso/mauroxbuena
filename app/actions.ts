"use server";
import db from "@/db";
import { properties } from "@/db/schemas/properties";
import { users, type User } from "@/db/schemas/users";
import { eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
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
  const managerId = formData.get("propertyManager");
  const accountantId = formData.get("accountant");
  const propertyName = formData.get("propertyName") as string;
  const propertyType = formData.get("type") as "WEG" | "MV";

  const [property] = await db
    .insert(properties)
    .values({
      name: propertyName,
      type: propertyType,
      managerId: managerId ? String(managerId) : null,
      accountantId: accountantId ? String(accountantId) : null,
      declarationUrl: "Mocked for now",
    })
    .returning();

  redirect(`/property/${property.id}`);
};

export const getUserNameById = async (id: string): Promise<string> => {
  const user = await db.select().from(users).where(eq(users.id, id));
  return user?.[0]?.name ?? "Unknown";
};
