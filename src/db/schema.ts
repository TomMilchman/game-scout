import {
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
    integer,
    pgEnum,
    unique,
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
    steam_app_id: integer("steam_app_id").unique(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    releaseDate: timestamp("release_date"),
});

export const users = pgTable("users", {
    id: varchar("id", { length: 100 }).primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    username: varchar("username", { length: 255 }),
});

export const userGames = pgTable(
    "user_games",
    {
        id: serial("id").primaryKey(),
        userId: varchar("user_id").references(() => users.id, {
            onDelete: "cascade",
        }),
        gameId: integer("game_id").references(() => games.id),
        status: statusEnum("status").notNull().default("never-played"),
    },
    (table) => [unique("unique_user_game").on(table.userId, table.gameId)]
);
