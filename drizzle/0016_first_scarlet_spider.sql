ALTER TABLE "prices" RENAME COLUMN "price" TO "base_price";--> statement-breakpoint
ALTER TABLE "prices" ADD COLUMN "current_price" numeric(10, 2);