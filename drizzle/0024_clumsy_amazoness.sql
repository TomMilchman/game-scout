ALTER TABLE "games" ADD COLUMN "average_rating" numeric(2, 1) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "rating_count" integer DEFAULT 0;