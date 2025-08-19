"use client";

import { UserGameStatus, userGameStatuses } from "@/app/types";
import { upsertUserGameStatus } from "@/db/user_games";
import { useState } from "react";

export default function ChangeGameStatus({
    initialStatus,
    userId,
    gameId,
}: {
    initialStatus: UserGameStatus;
    userId: string;
    gameId: number;
}) {
    const [status, setStatus] = useState(initialStatus);

    const onChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as UserGameStatus;
        setStatus(newStatus);

        try {
            await upsertUserGameStatus(userId, gameId, newStatus);
        } catch (err) {
            console.error("Failed to update status", err);
            setStatus(status);
        }
    };
    return (
        <select
            className="
                bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md
                focus:outline-none focus:ring-2 focus:ring-blue-500
                hover:bg-gray-600 transition-colors
            "
            title="Change Status"
            value={status || "Never Played"}
            onChange={onChange}
        >
            {userGameStatuses.map((status) => (
                <option key={status} value={status}>
                    {status}
                </option>
            ))}
        </select>
    );
}
