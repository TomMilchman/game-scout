"use client";

import { FullGameDetails } from "@/app/types";
import GameSearchRow from "./gameSearchRow";
import { useState, useMemo } from "react";

type SortOption =
    | "no-filter"
    | "name-asc"
    | "name-desc"
    | "date-asc"
    | "date-desc"
    | "rating-asc"
    | "rating-desc";

export default function GameSearchClientWrapper({
    userId,
    games,
    wishlistStatusByGameId,
}: {
    userId: string;
    games: FullGameDetails[];
    wishlistStatusByGameId: Record<number, boolean>;
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState<SortOption>("no-filter");

    const filteredGames = useMemo(() => {
        let result = [...games];

        if (searchTerm) {
            result = result.filter((game) =>
                game.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortOption === "no-filter") {
            return games;
        } else if (sortOption === "name-asc") {
            result.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOption === "name-desc") {
            result.sort((a, b) => b.title.localeCompare(a.title));
        } else if (sortOption === "date-asc") {
            result.sort(
                (a, b) =>
                    new Date(a.release_date).getTime() -
                    new Date(b.release_date).getTime()
            );
        } else if (sortOption === "date-desc") {
            result.sort(
                (a, b) =>
                    new Date(b.release_date).getTime() -
                    new Date(a.release_date).getTime()
            );
        } else if (sortOption === "rating-asc") {
            result.sort((a, b) => a.average_rating - b.average_rating);
        } else if (sortOption === "rating-desc") {
            result.sort((a, b) => b.average_rating - a.average_rating);
        }

        return result;
    }, [games, searchTerm, sortOption]);

    return (
        <div className="flex flex-col gap-6 mx-auto max-w-full">
            {/* Filter Bar */}
            <div className="sticky text-xs sm:text-base top-20 z-10 bg-gray-950 p-3 rounded-none shadow-md flex flex-wrap items-center gap-3">
                {/* Search box */}
                <input
                    type="text"
                    placeholder="Filter by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 flex-1 min-w-[200px] max-w-[350px]"
                />

                {/* Sort dropdown */}
                <select
                    title="Sort by"
                    value={sortOption}
                    onChange={(e) =>
                        setSortOption(e.target.value as SortOption)
                    }
                    className="text-xs sm:text-base px-3 py-2 rounded-md bg-gray-700 text-white"
                >
                    <option value="no-filter">No Filter</option>
                    <option value="name-asc">Name ↑</option>
                    <option value="name-desc">Name ↓</option>
                    <option value="date-asc">Release Date ↑</option>
                    <option value="date-desc">Release Date ↓</option>
                    <option value="rating-asc">Rating ↑</option>
                    <option value="rating-desc">Rating ↓</option>
                </select>
            </div>

            {/* Results */}
            <div className="flex flex-col gap-2 mx-2.5 mb-2.5">
                {filteredGames.map((game) => (
                    <GameSearchRow
                        key={game.id}
                        game={game}
                        userId={userId}
                        initialWishlisted={wishlistStatusByGameId[game.id]}
                    />
                ))}
            </div>
        </div>
    );
}
