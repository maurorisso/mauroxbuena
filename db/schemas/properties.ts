import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const propertyTypeEnum = pgEnum("property_type", ["WEG", "MV"]);

export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: propertyTypeEnum("type").notNull(),
  managerId: uuid("manager_id"),
  accountantId: uuid("accountant_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  declarationUrl: text("declaration_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
