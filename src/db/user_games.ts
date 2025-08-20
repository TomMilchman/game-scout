"use server";

import sql from "@/lib/db";
import { Game, UserGameStatus, userGameStatuses } from "@/app/types";

export async function upsertUserGameStatus(
    userId: string,
    gameId: number,
    status: UserGameStatus
) {
    await sql`
        INSERT INTO user_games (user_id, game_id, status)
        VALUES (${userId}, ${gameId}, ${status})
        ON CONFLICT (user_id, game_id) 
        DO 
            UPDATE SET status=${status}
        `;
}

export async function getUserGames(userId: string) {
    const rows = (await sql`
        SELECT g.*, ug.status
        FROM user_games ug
        JOIN games g ON g.id = ug.game_id
        WHERE ug.user_id = ${userId}
        ORDER BY g.title ASC
        ;`) as Game[];

    // Group by status
    const grouped = {} as Record<UserGameStatus, Game[]>;

    for (const status of userGameStatuses) {
        if (status === "Never Played") continue;

        grouped[status] = [];
    }

    for (const game of rows) {
        const status: UserGameStatus = game.status || "Never Played";

        if (status === "Never Played") continue;

        grouped[status].push(game);
    }

    return grouped;
}
