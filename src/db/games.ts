import sql from "@/lib/db";
import { GameDetails } from "steamapi";

export async function searchGamesByName(name: string, limit: number) {
    const normalized = name.replace(/[\s-]+/g, "%");

    return await sql`
    SELECT * 
    FROM games 
    WHERE title ILIKE ${"%" + normalized + "%"}
    LIMIT ${limit}`;
}

export async function cacheGames(gameDetailsArray: GameDetails[]) {
    const insertedGames = await Promise.all(
        gameDetailsArray.map((game) => insertGame(game))
    );

    return insertedGames;
}

export async function insertGame(gameDetails: GameDetails) {
    const releaseDateStr = gameDetails.releaseDate?.date ?? null;
    const releaseDate = releaseDateStr
        ? new Date(releaseDateStr).toISOString()
        : null;

    return await sql`
    INSERT INTO games (steam_app_id, title, description, release_date)
    VALUES (${gameDetails.id}, ${gameDetails.name}, ${gameDetails.shortDescription}, ${releaseDate})
    ON CONFLICT (steam_app_id) DO NOTHING
    RETURNING *
  `;
}
