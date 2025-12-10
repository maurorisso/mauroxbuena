import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  decimal,
  real,
  integer,
} from "drizzle-orm/pg-core";
import { buildings } from "./buildings";

export const unitTypeEnum = pgEnum("unit_type", [
  "Apartment",
  "Office",
  "Garden",
  "Parking",
]);
export const units = pgTable("units", {
  id: uuid("id").defaultRandom().primaryKey(),
  buildingId: uuid("building_id")
    .references(() => buildings.id, { onDelete: "cascade" })
    .notNull(),

  unitNumber: varchar("unit_number", { length: 50 }).notNull(),
  type: unitTypeEnum("type").notNull(),

  floor: integer("floor"),
  entrance: varchar("entrance", { length: 50 }),

  size: decimal("size", { precision: 10, scale: 2 }).notNull(),
  coOwnershipShare: decimal("co_ownership_share", { precision: 10, scale: 4 }),

  rooms: decimal("rooms", { precision: 10, scale: 2 }), //  allows "2.5 rooms" which is common in DACH
  constructionYear: integer("construction_year"),
  createdAt: timestamp("created_at").defaultNow(),
});
