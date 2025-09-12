"use server";

import sql from "@/lib/db";
import { FullGameDetails, UserGameStatus, userGameStatuses } from "@/app/types";

export async function upsertUserGameStatus(
    userId: string,
    gameId: number,
    status: UserGameStatus,
    status_change_date: Date
) {
    await sql`
        INSERT INTO user_games (user_id, game_id, status, status_change_date)
        VALUES (${userId}, ${gameId}, ${status}, ${status_change_date})
        ON CONFLICT (user_id, game_id)
        DO
            UPDATE SET
                status = EXCLUDED.status,
                status_change_date = EXCLUDED.status_change_date
        `;
}

export async function getUserGames(userId: string) {
    const rows = (await sql`
        SELECT g.*, ug.status, ug.status_change_date
        FROM user_games ug
        JOIN games g ON g.id = ug.game_id
        WHERE ug.user_id = ${userId}
        ORDER BY ug.status_change_date DESC
        ;`) as FullGameDetails[];

    // Group by status
    const grouped = {} as Record<UserGameStatus, FullGameDetails[]>;

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

export async function getUserGameStatus(
    userId: string,
    gameId: number
): Promise<UserGameStatus> {
    const rows = await sql`
    SELECT status FROM user_games
    WHERE user_id = ${userId} AND game_id = ${gameId};
  `;

    const res = rows[0];

    if (!res) {
        return "Never Played";
    }

    return res.status;
}
