CREATE TABLE "game_ratings" (
	"user_id" varchar,
	"game_id" integer,
	"rating" smallint NOT NULL,
	CONSTRAINT "game_ratings_user_id_game_id_pk" PRIMARY KEY("user_id","game_id")
);
--> statement-breakpoint
ALTER TABLE "wishlist" RENAME TO "wishlists";--> statement-breakpoint
ALTER TABLE "wishlists" DROP CONSTRAINT "wishlist_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "wishlists" DROP CONSTRAINT "wishlist_game_id_games_id_fk";
--> statement-breakpoint
ALTER TABLE "game_ratings" ADD CONSTRAINT "game_ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_ratings" ADD CONSTRAINT "game_ratings_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;