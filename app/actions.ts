"use server";
import db from "@/db";
import { buildings } from "@/db/schemas/buildings";
import { properties } from "@/db/schemas/properties";
import { units } from "@/db/schemas/units";
import { users, type User } from "@/db/schemas/users";
import { eq, inArray, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";
import { N8nWebhookData } from "@/types";

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
        id: propertyId,
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
        "https://n8n.almabrava.xyz/webhook/455c390d-4f1d-4b4f-877e-ce796fd86323",
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
        const responseData = await response.json();

        // n8n returns the processed data synchronously in the response
        if (
          responseData &&
          (Array.isArray(responseData) || responseData.property)
        ) {
          // Normalize data format: convert single object to array if needed
          const dataToProcess: N8nWebhookData = Array.isArray(responseData)
            ? (responseData as N8nWebhookData)
            : ([responseData] as N8nWebhookData);

          // Extract propertyId from response or use the one we sent
          const finalPropertyId =
            dataToProcess[0]?.property?.propertyId || propertyId;

          if (dataToProcess.length > 0) {
            await processN8nWebhookData(finalPropertyId, dataToProcess);
          }
        }
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

export const deleteProperty = async (propertyId: string): Promise<void> => {
  // Get property to check for files
  const [property] = await db
    .select()
    .from(properties)
    .where(eq(properties.id, propertyId));

  // Delete files from Supabase storage if they exist
  if (property?.declarationUrl) {
    try {
      const supabase = await createClient();
      // Extract the folder path (propertyId)
      const folderPath = propertyId;
      // List all files in the property folder
      const { data: files } = await supabase.storage
        .from("reports")
        .list(folderPath);

      if (files && files.length > 0) {
        // Delete all files in the folder
        const filePaths = files.map((file) => `${folderPath}/${file.name}`);
        await supabase.storage.from("reports").remove(filePaths);
      }
    } catch (error) {
      console.error("Failed to delete files from storage:", error);
      // Continue with property deletion even if file deletion fails
    }
  }

  // Delete the property (buildings and units will be cascade deleted)
  await db.delete(properties).where(eq(properties.id, propertyId));

  // Revalidate the properties page to refresh the list
  revalidatePath("/");
};

export const processN8nWebhookData = async (
  propertyId: string,
  data: N8nWebhookData
): Promise<void> => {
  if (!data || data.length === 0) {
    throw new Error("No data provided");
  }

  const parsedData = data[0];

  // Verify property exists
  const [existingProperty] = await db
    .select()
    .from(properties)
    .where(eq(properties.id, propertyId));

  if (!existingProperty) {
    throw new Error(`Property with id ${propertyId} not found`);
  }

  // Update property name and type if they differ (in case n8n parsed different values)
  if (
    existingProperty.name !== parsedData.property.name ||
    existingProperty.type !== parsedData.property.type
  ) {
    await db
      .update(properties)
      .set({
        name: parsedData.property.name,
        type: parsedData.property.type,
        updatedAt: new Date(),
      })
      .where(eq(properties.id, propertyId));
  }

  // Process buildings and units
  for (const buildingData of parsedData.buildings) {
    // Check if building already exists
    const [existingBuilding] = await db
      .select()
      .from(buildings)
      .where(
        and(
          eq(buildings.propertyId, propertyId),
          eq(buildings.street, buildingData.street),
          eq(buildings.houseNumber, buildingData.houseNumber)
        )
      );

    let buildingId: string;
    if (existingBuilding) {
      buildingId = existingBuilding.id;
    } else {
      // Create new building
      const [newBuilding] = await db
        .insert(buildings)
        .values({
          propertyId,
          street: buildingData.street,
          houseNumber: buildingData.houseNumber,
          zipCode: buildingData.zipCode,
          city: buildingData.city,
        })
        .returning();

      if (!newBuilding) {
        throw new Error("Failed to create building");
      }
      buildingId = newBuilding.id;
    }

    let unitsCreated = 0;
    let unitsSkipped = 0;

    for (const unitData of buildingData.units) {
      // Check if unit already exists
      const [existingUnit] = await db
        .select()
        .from(units)
        .where(
          and(
            eq(units.buildingId, buildingId),
            eq(units.unitNumber, unitData.unitNumber)
          )
        );

      if (!existingUnit) {
        // Create new unit

        try {
          await db.insert(units).values({
            buildingId,
            unitNumber: unitData.unitNumber,
            type: unitData.type,
            floor: unitData.floor,
            entrance: unitData.entrance,
            size: unitData.size.toString(),
            coOwnershipShare: unitData.coOwnershipShare
              ? unitData.coOwnershipShare.toString()
              : null,
            rooms: unitData.rooms ? unitData.rooms.toString() : null,
            constructionYear: unitData.constructionYear,
          });
          unitsCreated++;
        } catch (error) {
          console.error("[processN8nWebhookData] Error creating unit:", error);
          throw error;
        }
      } else {
        console.log(
          "[processN8nWebhookData] Unit already exists:",
          unitData.unitNumber
        );
        unitsSkipped++;
      }
    }
  }
};
