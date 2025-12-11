"use server";
import db from "@/db";
import { buildings } from "@/db/schemas/buildings";
import { properties } from "@/db/schemas/properties";
import { units } from "@/db/schemas/units";
import { users, type User } from "@/db/schemas/users";
import { eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";

// Strip accents and unsafe characters so Supabase storage keys stay valid
const sanitizeFileName = (name: string) =>
  name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
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
  const divisionDeclarationFile = formData.get(
    "divisionDeclaration"
  ) as File | null;

  let fileUrl = null;
  const propertyId = uuidv4();
  let publicUrl = null;

  if (divisionDeclarationFile && divisionDeclarationFile.size > 0) {
    // Unique filename to prevent overwrites
    const safeName = sanitizeFileName(divisionDeclarationFile.name);
    const fileName = `${Date.now()}-${safeName || "file"}`;
    const storagePath = `${propertyId}/${fileName}`; // store file under the property folder

    // 3. Upload to Supabase Storage
    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from("reports")
      .upload(storagePath, divisionDeclarationFile, {
        contentType: divisionDeclarationFile.type,
        upsert: false,
      });

    if (error) {
      console.error("Upload failed:", error);
      throw new Error("File upload failed");
    }

    fileUrl = data?.path ?? null;
    publicUrl =
      supabase.storage.from("reports").getPublicUrl(fileUrl).data?.publicUrl ??
      null;
    console.log("File uploaded successfully:", fileUrl);

    // Create property first
    const [property] = await db
      .insert(properties)
      .values({
        name: propertyName,
        type: propertyType,
        managerId: managerId ? String(managerId) : null,
        accountantId: accountantId ? String(accountantId) : null,
        declarationUrl: fileUrl ?? "",
      })
      .returning();

    // Notify n8n webhook with the uploaded file info
    try {
      const response = await fetch(
        "https://n8n.almabrava.xyz/webhook-test/455c390d-4f1d-4b4f-877e-ce796fd86323",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propertyId,
            filePath: fileUrl,
            publicUrl,
            fileName,
          }),
        }
      );
      if (!response.ok) {
        console.error("Failed to notify n8n webhook", response.statusText);
      } else {
        console.log("n8n webhook notified successfully");
      }
    } catch (err) {
      console.error("Failed to notify n8n webhook", err);
    }

    // Redirect after n8n response (success or failure)
    redirect(`/property/${property.id}`);
  } else {
    // No file uploaded - create property and redirect immediately
    const [property] = await db
      .insert(properties)
      .values({
        name: propertyName,
        type: propertyType,
        managerId: managerId ? String(managerId) : null,
        accountantId: accountantId ? String(accountantId) : null,
        declarationUrl: fileUrl ?? "",
      })
      .returning();

    redirect(`/property/${property.id}`);
  }
};

export const getUserNameById = async (id: string): Promise<string> => {
  const user = await db.select().from(users).where(eq(users.id, id));
  return user?.[0]?.name ?? "Unknown";
};

export const getUnitsByPropertyId = async (propertyId: string) => {
  const unitsData = await db
    .select({ units })
    .from(units)
    .innerJoin(buildings, eq(units.buildingId, buildings.id))
    .where(eq(buildings.propertyId, propertyId));

  return unitsData.map((item) => item.units);
};
