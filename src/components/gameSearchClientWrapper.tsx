"use client";

import { Game } from "@/app/types";
import GameSearchRow from "./gameSearchRow";
import { useState, useMemo } from "react";

type SortOption =
    | "no-filter"
    | "name-asc"
    | "name-desc"
    | "date-asc"
    | "date-desc";

export default function GameSearchClientWrapper({
    games,
    userId,
}: {
    games: Game[];
    userId: string;
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
        }

        return result;
    }, [games, searchTerm, sortOption]);

    return (
        <div className="flex flex-col gap-4 mx-auto max-w-full">
            {/* Filter Bar */}
            <div className="sticky top-16 z-10 bg-gray-950 p-3 rounded-none shadow-md flex flex-wrap items-center gap-3">
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
                    className="px-3 py-2 rounded-md bg-gray-700 text-white"
                >
                    <option value="no-filter">No Filter</option>
                    <option value="name-asc">Name ↑</option>
                    <option value="name-desc">Name ↓</option>
                    <option value="date-asc">Release Date ↑</option>
                    <option value="date-desc">Release Date ↓</option>
                </select>
            </div>

            {/* Results */}
            <div className="flex flex-col gap-2 mx-2.5 mb-2.5">
                {filteredGames.map((game) => (
                    <GameSearchRow key={game.id} game={game} userId={userId} />
                ))}
            </div>
        </div>
    );
}
