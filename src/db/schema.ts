import {
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
    integer,
    pgEnum,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
    "never-played",
    "playing",
    "on-hold",
    "finished",
    "completed",
    "dropped",
]);

export const games = pgTable("games", {
    id: serial("id").primaryKey(),
    steam_app_id: integer("steam_app_id"),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    releaseDate: timestamp("release_date"),
});

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }),
});

export const userGames = pgTable("user_games", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id),
    gameId: integer("game_id").references(() => games.id),
    status: statusEnum("status").notNull(),
});
