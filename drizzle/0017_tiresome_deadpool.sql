ALTER TABLE "prices" ALTER COLUMN "store" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "prices" ALTER COLUMN "store" SET DEFAULT 'Steam'::text;--> statement-breakpoint
DROP TYPE "public"."store";--> statement-breakpoint
CREATE TYPE "public"."store" AS ENUM('Steam', 'GOG');--> statement-breakpoint
ALTER TABLE "prices" ALTER COLUMN "store" SET DEFAULT 'Steam'::"public"."store";--> statement-breakpoint
ALTER TABLE "prices" ALTER COLUMN "store" SET DATA TYPE "public"."store" USING "store"::"public"."store";