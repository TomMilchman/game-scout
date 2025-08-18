ALTER TABLE "user_games" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_games" ALTER COLUMN "status" SET DEFAULT 'Never Played'::text;--> statement-breakpoint
DROP TYPE "public"."status";--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('Never Played', 'Playing', 'On Hold', 'Finished', 'Completed', 'Dropped');--> statement-breakpoint
ALTER TABLE "user_games" ALTER COLUMN "status" SET DEFAULT 'Never Played'::"public"."status";--> statement-breakpoint
ALTER TABLE "user_games" ALTER COLUMN "status" SET DATA TYPE "public"."status" USING "status"::"public"."status";