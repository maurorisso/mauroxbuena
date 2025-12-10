CREATE TYPE "public"."unit_type" AS ENUM('Apartment', 'Office', 'Garden', 'Parking');--> statement-breakpoint
CREATE TABLE "units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"building_id" uuid NOT NULL,
	"unit_number" varchar(50) NOT NULL,
	"type" "unit_type" NOT NULL,
	"floor" integer,
	"entrance" varchar(50),
	"size" numeric(10, 2) NOT NULL,
	"co_ownership_share" numeric(10, 4),
	"rooms" numeric(10, 2),
	"construction_year" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_building_id_buildings_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;