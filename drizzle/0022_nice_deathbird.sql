CREATE TABLE "wishlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"game_id" integer,
	"added_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_wishlist" UNIQUE("user_id","game_id")
);
--> statement-breakpoint
ALTER TABLE "user_games" ADD COLUMN "status_change_date" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;