import sql from "@/lib/db";
import { GameDetails } from "steamapi";
import { Game } from "@/app/types";

const normalize = (gameName: string) => gameName.replace(/[\s-]+/g, "%");

export async function searchGamesByName(
    query: string,
    userId: string,
    limit: number
) {
    const normalized = normalize(query);

    return (await sql`
        SELECT g.*, ug.status
        FROM games g
        LEFT JOIN user_games ug
        ON ug.game_id = g.id
        AND ug.user_id = ${userId}
        WHERE g.title ILIKE ${"%" + normalized + "%"}
        LIMIT ${limit};
        `) as Game[];
}

export async function upsertGames(games: GameDetails[]) {
    if (games.length === 0) return [];

    await Promise.all(
        games.map(
            (game) =>
                sql`
                INSERT INTO games (steam_app_id, title, description, release_date, header_image)
                VALUES (${game.id}, ${game.name}, ${game.shortDescription}, ${game.releaseDate?.date}, ${game.headerImage})
                ON CONFLICT (steam_app_id) DO 
                UPDATE SET
                    title = EXCLUDED.title,
                    description = EXCLUDED.description,
                    header_image = EXCLUDED.header_image
                `
        )
    );
}

export async function countGamesByQuery(query: string): Promise<number> {
    const normalized = normalize(query);

    const result = await sql`
        SELECT COUNT(*)::int AS count
        FROM games
        WHERE title ILIKE ${`%${normalized}%`}
    `;

    return result[0]?.count ?? 0;
}
