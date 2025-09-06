"use server";

import { Game } from "@/app/types";
import sql from "@/lib/db";

export async function getWishlist(userId: string) {
    return (await sql`
        SELECT g.id, g.title, g.release_date, g.capsule_image, g.header_image, w.added_at
        FROM games g
        JOIN wishlist w on g.id = w.game_id
        WHERE w.user_id = ${userId}
        ;`) as Game[];
}

export async function addToWishlist(userId: string, gameId: number) {
    return await sql`
    INSERT INTO wishlist (user_id, game_id)
    VALUES (${userId}, ${gameId})
    ON CONFLICT DO NOTHING;
    `;
}

export async function removeFromWishlist(userId: string, gameId: number) {
    return await sql`
    DELETE FROM wishlist
    WHERE user_id = ${userId} AND game_id = ${gameId};
    `;
}

export async function isGameInUserWishlist(userId: string, gameId: number) {
    const result = await sql`
    SELECT 1
    FROM wishlist
    WHERE user_id = ${userId} AND game_id = ${gameId}
    LIMIT 1
    `;

    return result.length > 0;
}
