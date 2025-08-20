"use client";

import { Game, UserGameStatus } from "@/app/types";
import Link from "next/link";
import { useState } from "react";
import ChangeGameStatus from "./changeGameStatus";

type Props = {
    gamesByStatus: Record<UserGameStatus, Game[]>;
    userId: string;
};

export default function StatusSections({ gamesByStatus, userId }: Props) {
    const [groups, setGroups] = useState(gamesByStatus);

    const handleStatusChange = (
        gameId: number,
        oldStatus: UserGameStatus,
        newStatus: UserGameStatus
    ) => {
        setGroups((prev) => {
            const newGroups = { ...prev };
            const gameIndex = newGroups[oldStatus].findIndex(
                (g) => g.id === gameId
            );

            if (gameIndex !== -1) {
                const [game] = newGroups[oldStatus].splice(gameIndex, 1);
                game.status = newStatus;
                newGroups[newStatus].push(game);
            }

            return newGroups;
        });
    };

    return (
        <>
            {Object.entries(groups).map(([status, games]) => (
                <section key={status} className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-200 mb-4">
                        {status}
                    </h2>

                    {games.length === 0 ? (
                        <p className="text-gray-400 italic">
                            No games in this status yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {games.map((game: Game) => (
                                <div
                                    key={game.id}
                                    className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                                >
                                    <Link href={`/game/${game.id}`}>
                                        <img
                                            src={
                                                game.capsule_image ||
                                                game.header_image
                                            }
                                            alt={game.title}
                                            className="w-full h-32 object-cover"
                                        />
                                    </Link>
                                    <div className="p-3 flex flex-col gap-2">
                                        <Link href={`/game/${game.id}`}>
                                            <h3 className="text-white font-semibold hover:underline">
                                                {game.title}
                                            </h3>
                                        </Link>
                                        <p className="text-gray-400 text-sm">
                                            Released: {game.release_date}
                                        </p>
                                        <ChangeGameStatus
                                            initialStatus={
                                                game.status || "Never Played"
                                            }
                                            gameId={game.id}
                                            userId={userId || ""}
                                            onStatusChange={(newStatus) =>
                                                handleStatusChange(
                                                    game.id,
                                                    game.status ||
                                                        "Never Played",
                                                    newStatus
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            ))}
            ;
        </>
    );
}
