"use client";

import { Game, UserGameStatus, userGameStatuses } from "@/app/types";
import { upsertUserGameStatus } from "@/db/user_games";
import { useState } from "react";

export default function GameSearchRow({
    game,
    userId,
}: {
    game: Game;
    userId: string;
}) {
    const [status, setStatus] = useState(game.status);

    return (
        <div>
            <div>{game.title}</div>
            <select
                title="Change Status"
                value={status || "Never Played"}
                onChange={async (e) => {
                    const newStatus = e.target.value as UserGameStatus;
                    setStatus(newStatus);

                    try {
                        await upsertUserGameStatus(userId, game.id, newStatus);
                    } catch (err) {
                        console.error("Failed to update status", err);
                        setStatus(status);
                    }
                }}
            >
                {userGameStatuses.map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>
        </div>
    );
}
