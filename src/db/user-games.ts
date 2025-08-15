import sql from "@/lib/db";

type Status =
    | "never-played"
    | "playing"
    | "on-hold"
    | "finished"
    | "completed"
    | "dropped";

export async function upsertUserGame(
    userId: string,
    gameId: string,
    status: Status
) {
    await sql`
        INSERT INTO user_games (user_id, game_id, status)
        VALUES (${userId}, ${gameId}, ${status})
        ON CONFLICT (user_id, game_id) DO UPDATE 
        SET status=${status}
        `;
}
