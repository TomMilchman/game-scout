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

export async function areGamesInUserWishlist(
    userId: string,
    gameIds: number[]
): Promise<Record<number, boolean>> {
    if (gameIds.length === 0) return {};

    const result = await sql`
        SELECT game_id
        FROM wishlist
        WHERE user_id = ${userId}
        AND game_id = ANY(${gameIds})
    `;

    const wishlistSet = new Set(result.map((row) => row.game_id));
    const wishlistStatusByGameId = gameIds.reduce<Record<number, boolean>>(
        (acc, id) => {
            acc[id] = wishlistSet.has(Number(id));
            return acc;
        },
        {}
    );

    return wishlistStatusByGameId;
}
