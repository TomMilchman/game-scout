"use client";

import { FullGameDetails, UserGameStatus } from "@/app/types";
import Link from "next/link";
import { useState } from "react";
import ChangeGameStatus from "./changeGameStatus";

type Props = {
    gamesByStatus: Record<UserGameStatus, FullGameDetails[]>;
};

export default function StatusSections({ gamesByStatus }: Props) {
    const [groups, setGroups] = useState(gamesByStatus);
    const [activeStatus, setActiveStatus] = useState<UserGameStatus>("Playing");

    const handleStatusChange = (
        gameId: number,
        oldStatus: UserGameStatus,
        newStatus: UserGameStatus,
        changeDate: Date
    ) => {
        setGroups((prev) => {
            const newGroups = { ...prev };
            const gameIndex = newGroups[oldStatus].findIndex(
                (g) => g.id === gameId
            );

            if (gameIndex !== -1) {
                const [game] = newGroups[oldStatus].splice(gameIndex, 1);
                game.status = newStatus;
                game.status_change_date = changeDate;
                newGroups[newStatus].push(game);
                newGroups[newStatus].sort(
                    (a, b) =>
                        (b.status_change_date?.getTime() ?? 0) -
                        (a.status_change_date?.getTime() ?? 0)
                );
            }

            return newGroups;
        });
    };

    return (
        <>
            {/* Sticky status bar */}
            <div className="sticky top-21 sm:top-16 z-10 bg-gray-900 border-b border-gray-700 shadow-md">
                <div className="relative">
                    {/* Scrollable container */}
                    <div className="flex sm:justify-center overflow-x-auto whitespace-nowrap px-4 py-2 gap-2 scrollbar-hide">
                        {Object.keys(groups).map((status) => (
                            <button
                                type="button"
                                key={status}
                                onClick={() =>
                                    setActiveStatus(status as UserGameStatus)
                                }
                                className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition
                  ${
                      activeStatus === status
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Fades at edges */}
                    <div className="pointer-events-none absolute top-0 left-0 h-full w-6 bg-gradient-to-r from-gray-900 to-transparent" />
                    <div className="pointer-events-none absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-gray-900 to-transparent" />
                </div>
            </div>

            {/* Active status section */}
            <section className="mt-6 px-2 sm:px-0">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 mb-4">
                    {activeStatus}
                </h2>

                {groups[activeStatus]?.length === 0 ? (
                    <p className="text-gray-400 italic">
                        No games in this status yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {groups[activeStatus].map((game: FullGameDetails) => (
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
                                        className="w-full h-20 sm:h-32 object-cover"
                                    />
                                </Link>
                                <div className="p-2 sm:p-3 flex flex-col gap-1 sm:gap-2">
                                    <Link href={`/game/${game.id}`}>
                                        <h3 className="text-white text-[12px] sm:text-base font-semibold hover:underline truncate">
                                            {game.title}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-400 text-[11px] sm:text-sm">
                                        Release: {game.release_date}
                                    </p>
                                    <ChangeGameStatus
                                        initialStatus={
                                            game.status || "Never Played"
                                        }
                                        gameId={game.id}
                                        onStatusChange={(
                                            newStatus,
                                            changeDate
                                        ) =>
                                            handleStatusChange(
                                                game.id,
                                                game.status || "Never Played",
                                                newStatus,
                                                changeDate
                                            )
                                        }
                                    />
                                    <div className="mx-auto text-gray-500 text-[11px] sm:text-xs">
                                        {game.status_change_date &&
                                            `Updated: ${
                                                game.status_change_date
                                                    .toLocaleDateString()
                                                    .split(" ")[0]
                                            }`}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}
