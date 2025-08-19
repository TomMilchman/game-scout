import {
    pgTable,
    serial,
    text,
    varchar,
    integer,
    pgEnum,
    unique,
    timestamp,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
    "Never Played",
    "Playing",
    "On Hold",
    "Finished",
    "Completed",
    "Dropped",
]);

export const games = pgTable("games", {
    id: serial("id").primaryKey(),
    steam_app_id: integer("steam_app_id").unique(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    releaseDate: varchar("release_date", { length: 24 }),
    header_image: text("header_image"),
    capsule_image: text("capsule_image"),
    type: varchar("type", { length: 24 }),
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
        status: statusEnum("status").notNull().default("Never Played"),
    },
    (table) => [unique("unique_user_game").on(table.userId, table.gameId)]
);

export const cachedQueries = pgTable("cached_queries", {
    query: text("query").primaryKey(),
    scrapedAt: timestamp("scraped_at").notNull(),
    totalGames: integer("total_games").notNull().default(0),
});
