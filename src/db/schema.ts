import {
    pgTable,
    serial,
    text,
    varchar,
    integer,
    pgEnum,
    unique,
    timestamp,
    numeric,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
    "Never Played",
    "Playing",
    "On Hold",
    "Finished",
    "Completed",
    "Dropped",
]);

export const storeEnum = pgEnum("store", ["Steam", "GOG", "GreenManGaming"]);

export const games = pgTable("games", {
    id: serial("id").primaryKey(),
    steam_app_id: integer("steam_app_id").unique(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    release_date: varchar("release_date", { length: 24 }),
    header_image: text("header_image"),
    capsule_image: text("capsule_image"),
    type: varchar("type", { length: 24 }),
    last_updated: timestamp("last_updated").notNull().defaultNow(),
});

export const prices = pgTable(
    "prices",
    {
        id: serial("id").primaryKey(),
        gameId: integer("game_id").references(() => games.id, {
            onDelete: "cascade",
        }),
        store: storeEnum("store").notNull().default("Steam"),
        base_price: numeric("base_price", { precision: 10, scale: 2 }),
        current_price: numeric("current_price", { precision: 10, scale: 2 }),
        currency: varchar("currency", { length: 3 }),
        url: text("url"),
        last_updated: timestamp("last_updated").notNull().defaultNow(),
    },
    (table) => [unique("unique_store").on(table.gameId, table.store)]
);

export const users = pgTable("users", {
    id: varchar("id", { length: 100 }).primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    username: varchar("username", { length: 255 }),
});

export const userGames = pgTable(
    "user_games",
    {
        id: serial("id").primaryKey(),
        user_id: varchar("user_id").references(() => users.id, {
            onDelete: "cascade",
        }),
        game_id: integer("game_id").references(() => games.id, {
            onDelete: "cascade",
        }),
        status: statusEnum("status").notNull().default("Never Played"),
    },
    (table) => [unique("unique_user_game").on(table.user_id, table.game_id)]
);
