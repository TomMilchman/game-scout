CREATE TYPE "public"."status" AS ENUM('never-played', 'playing', 'on-hold', 'finished', 'completed', 'dropped');--> statement-breakpoint
CREATE TABLE "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"steam_app_id" integer,
	"title" varchar(255) NOT NULL,
	"description" text,
	"release_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_games" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"game_id" integer,
	"status" "status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "user_games" ADD CONSTRAINT "user_games_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_games" ADD CONSTRAINT "user_games_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;