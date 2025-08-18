"use server";

import sql from "@/lib/db";
import { UserGameStatus } from "@/app/types";

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
