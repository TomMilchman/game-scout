import { pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
    "never-played",
    "playing",
    "on-hold",
    "finished",
    "completed",
    "dropped",
]);
