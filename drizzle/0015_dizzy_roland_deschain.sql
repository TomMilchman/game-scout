CREATE TYPE "public"."store" AS ENUM('Steam', 'Epic', 'GOG');--> statement-breakpoint
CREATE TABLE "prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer,
	"store" "store" DEFAULT 'Steam' NOT NULL,
	"price" numeric(10, 2),
	"currency" varchar(3),
	"url" text,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_store" UNIQUE("game_id","store")
);
--> statement-breakpoint
ALTER TABLE "user_games" DROP CONSTRAINT "user_games_game_id_games_id_fk";
--> statement-breakpoint
ALTER TABLE "prices" ADD CONSTRAINT "prices_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_games" ADD CONSTRAINT "user_games_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;