CREATE TYPE "public"."property_type" AS ENUM('WEG', 'MV');--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" "property_type" NOT NULL,
	"manager_id" uuid,
	"accountant_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"declaration_url" text,
	"updated_at" timestamp with time zone DEFAULT now()
);
