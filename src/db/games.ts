"use server";

import sql from "@/lib/db";
import { GameDetails } from "steamapi";
import { Game } from "@/app/types";

const normalize = (gameName: string) => gameName.replace(/[\s-]+/g, "%");

export async function getGamesById(gameIds: number[], userId: string) {
    const rows = await sql`
        SELECT g.*, ug.status, r.user_rating
        FROM games g
        LEFT JOIN user_games ug
            ON ug.game_id = g.id
            AND ug.user_id = ${userId}
        LEFT JOIN game_ratings r
            ON r.game_id = g.id
            AND r.user_id = ${userId}
        WHERE g.id = ANY(${gameIds});
        `;

    const games: Game[] = rows.map((r) => ({
        id: r.id,
        steam_app_id: r.steam_app_id,
        title: r.title,
        description: r.description,
        release_date: r.release_date,
        header_image: r.header_image,
        capsule_image: r.capsule_image,
        status: r.status,
        status_change_date: r.status_change_date,
        last_updated: r.last_updated,
        average_rating: Number(r.average_rating),
        rating_count: r.rating_count,
        user_rating: Number(r.user_rating),
    }));

    return games;
}

export async function searchGamesByName(
    query: string,
    userId: string,
    limit: number
) {
    const normalized = normalize(query);

    return (await sql`
        SELECT g.*, ug.status, r.user_rating
        FROM games g
        LEFT JOIN user_games ug
            ON ug.game_id = g.id
            AND ug.user_id = ${userId}
        LEFT JOIN game_ratings r
            ON r.game_id = g.id
            AND r.user_id = ${userId}
        WHERE g.title ILIKE ${"%" + normalized + "%"}
        LIMIT ${limit};
        `) as Game[];
}

export async function upsertGames(games: GameDetails[]) {
    await Promise.all(
        games.map(
            (game) =>
                sql`
                    INSERT INTO games (steam_app_id, title, description, release_date, header_image, capsule_image, last_updated, average_rating, rating_count)
                    VALUES (${game.id}, ${game.name}, ${
                    game.shortDescription
                }, ${game.releaseDate?.date}, ${game.headerImage}, ${
                    game.capsuleImage
                }, ${new Date()}, 0, 0)
                    ON CONFLICT (steam_app_id) DO
                    UPDATE SET
                        title = EXCLUDED.title,
                        description = EXCLUDED.description,
                        header_image = EXCLUDED.header_image,
                        capsule_image = EXCLUDED.capsule_image,
                        last_updated = EXCLUDED.last_updated
                `
        )
    );
}
