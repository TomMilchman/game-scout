import sql from "@/lib/db";
import { GameDetails } from "steamapi";

export async function searchGamesByName(
    gameName: string,
    userId: string,
    limit: number
) {
    const normalized = gameName.replace(/[\s-]+/g, "%");

    return await sql`
    SELECT g.*, ug.status
    FROM games g
    LEFT JOIN user_games ug
    ON ug.game_id = g.id
    AND ug.user_id = ${userId}
    WHERE g.title ILIKE ${"%" + normalized + "%"}
    LIMIT ${limit};
    `;
}

export async function cacheGames(
    gameDetailsArray: GameDetails[],
    userId: string
) {
    const insertedGames = await Promise.all(
        gameDetailsArray.map((game) => insertGame(game, userId))
    );

    return insertedGames;
}

export async function insertGame(gameDetails: GameDetails, userId: string) {
    const releaseDateStr = gameDetails.releaseDate?.date ?? null;
    const releaseDate = releaseDateStr
        ? new Date(releaseDateStr).toISOString()
        : null;

    await sql`
    INSERT INTO games (steam_app_id, title, description, release_date)
    VALUES (${gameDetails.id}, ${gameDetails.name}, ${gameDetails.shortDescription}, ${releaseDate})
    ON CONFLICT (steam_app_id) DO NOTHING
    ;`;

    return await sql`
    SELECT g.*, ug.status
    FROM games g
    LEFT JOIN user_games ug
    ON ug.game_id = g.id
    AND ug.user_id = ${userId}
    WHERE g.steam_app_id = ${gameDetails.id};`;
}
