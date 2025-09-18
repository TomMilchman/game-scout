"use server";

import { Ratings } from "@/app/types";
import sql from "@/lib/db";

export async function upsertUserRating(
    userId: string,
    gameId: number,
    userRating: Ratings
) {
    await sql`
        INSERT INTO game_ratings (user_id, game_id, user_rating)
        VALUES (${userId}, ${gameId}, ${userRating})
        ON CONFLICT (user_id, game_id) DO UPDATE
            SET user_rating = EXCLUDED.user_rating
    `;

    const [result] = await sql`
    UPDATE games
    SET
        average_rating = sub.avg_rating,
        rating_count = sub.rating_count
    FROM (
        SELECT AVG(user_rating)::numeric(2,1) AS avg_rating,
               COUNT(*) AS rating_count,
               game_id
        FROM game_ratings
        WHERE game_id = ${gameId}
        GROUP BY game_id
    ) AS sub
    WHERE games.id = sub.game_id
    RETURNING games.average_rating, games.rating_count
`;

    return {
        average_rating: Number(result.average_rating),
        rating_count: Number(result.rating_count),
    };
}
