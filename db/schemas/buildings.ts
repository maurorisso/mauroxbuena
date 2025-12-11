import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { properties } from "./properties";

export const buildings = pgTable("buildings", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .references(() => properties.id, { onDelete: "cascade" })
    .notNull(),
  street: text("street").notNull(),
  houseNumber: varchar("house_number", { length: 100 }).notNull(), // Varchar to support "12a" or "26 / Trendelenburgstraße 17"
  zipCode: varchar("zip_code", { length: 20 }),
  city: text("city"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Building = typeof buildings.$inferSelect;
export type NewBuilding = typeof buildings.$inferInsert;