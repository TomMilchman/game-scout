"use client";
import { rateGame } from "@/app/server/games";
import { Ratings } from "@/app/types";
import { startTransition, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface InteractiveStarRatingProps {
    gameId: number;
    averageRating: number;
    ratingCount: number;
    userRating: number;
}

export function InteractiveStarRating({
    gameId,
    averageRating,
    ratingCount,
    userRating,
}: InteractiveStarRatingProps) {
    const [hovered, setHovered] = useState<number | null>(null);
    const [tempUserRating, setTempUserRating] = useState(userRating ?? 0);
    const [avgRating, setAvgRating] = useState(averageRating);
    const [count, setCount] = useState(ratingCount);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const displayRating = hovered ?? tempUserRating;

    const renderStar = (i: number) => {
        if (i <= displayRating)
            return (
                <FaStar
                    key={i}
                    className={`text-sm md:text-lg ${
                        loading ? "text-gray-400" : "text-yellow-400"
                    }`}
                />
            );
        else if (i - displayRating < 1)
            return (
                <FaStarHalfAlt
                    key={i}
                    className={`text-sm md:text-lg ${
                        loading ? "text-gray-400" : "text-yellow-400"
                    }`}
                />
            );
        else
            return (
                <FaRegStar
                    key={i}
                    className={`text-sm md:text-lg ${
                        loading ? "text-gray-400" : "text-gray-300"
                    }`}
                />
            );
    };

    const handleRate = (rating: Ratings) => {
        setLoading(true);
        setError(null);

        startTransition(async () => {
            try {
                const result = await rateGame(gameId, rating);
                setAvgRating(result.data?.average_rating || averageRating);
                setCount(result.data?.rating_count || ratingCount);
            } catch (error: unknown) {
                const message =
                    error instanceof Error ? error.message : String(error);
                console.error("Failed to rate game:", message);
                setError(message);
            } finally {
                setLoading(false);
            }
        });
    };

    return (
        <div className="flex flex-col gap-1 items-start">
            <div className="text-gray-400 text-sm md:text-lg">
                ⭐ {avgRating.toFixed(1)} ({count} ratings)
            </div>
            <div className="flex gap-0.5">
                {([1, 2, 3, 4, 5] as Ratings[]).map((i) => (
                    <span
                        key={i}
                        onMouseEnter={() => !loading && setHovered(i)}
                        onMouseLeave={() => !loading && setHovered(null)}
                        onClick={() => {
                            if (!loading) {
                                setTempUserRating(i);
                                handleRate(i);
                            }
                        }}
                        className={`cursor-pointer ${
                            loading ? "pointer-events-none opacity-70" : ""
                        }`}
                    >
                        {renderStar(i)}
                    </span>
                ))}
            </div>
            {error && (
                <p className="text-red-500">Failed to update rating: {error}</p>
            )}
        </div>
    );
}
