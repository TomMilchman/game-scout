import sql from "@/lib/db";
import { UserGameStatus } from "@/app/types";

export async function upsertUserGame(
    userId: string,
    gameId: string,
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
