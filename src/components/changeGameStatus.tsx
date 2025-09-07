"use client";

import { changeUserGameStatus } from "@/app/server/games";
import { UserGameStatus, userGameStatuses } from "@/app/types";
import { useState } from "react";

export default function ChangeGameStatus({
    initialStatus,
    userId,
    gameId,
    onStatusChange,
}: {
    initialStatus: UserGameStatus;
    userId: string;
    gameId: number;
    onStatusChange?: (newStatus: UserGameStatus, changeDate: Date) => void;
}) {
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const prevStatus = status;
        const newStatus = e.target.value as UserGameStatus;
        setStatus(newStatus);
        setError(null);
        setLoading(true);

        const changeDate = new Date();

        try {
            const result = await changeUserGameStatus(
                userId,
                gameId,
                prevStatus,
                newStatus,
                changeDate
            );

            if (result.success) {
                onStatusChange?.(newStatus, changeDate);
            } else {
                throw new Error(result.error ?? "Failed to update status.");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error("Failed to update status:", message);
            setStatus(prevStatus);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <select
                className="
                    bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    hover:bg-gray-600 transition-colors
                "
                title="Change Status"
                value={status || "Never Played"}
                onChange={handleChange}
                disabled={loading}
            >
                {userGameStatuses.map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 mt-1">{error}</p>}
        </div>
    );
}
