"use client";
import { Ratings } from "@/app/types";
import { upsertUserRating } from "@/db/game_ratings";
import { startTransition, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface InteractiveStarRatingProps {
    userId: string;
    gameId: number;
    averageRating: number;
    ratingCount: number;
    userRating: number;
}

export function InteractiveStarRating({
    userId,
    gameId,
    averageRating,
    ratingCount,
    userRating,
}: InteractiveStarRatingProps) {
    const [hovered, setHovered] = useState<number | null>(null);
    const [tempUserRating, setTempUserRating] = useState(userRating ?? 0);

    const displayRating = hovered ?? tempUserRating;

    const renderStar = (i: number) => {
        if (i <= displayRating)
            return <FaStar key={i} className="text-yellow-400 text-lg" />;
        else if (i - displayRating < 1)
            return (
                <FaStarHalfAlt key={i} className="text-yellow-400 text-lg" />
            );
        else return <FaRegStar key={i} className="text-gray-300 text-lg" />;
    };

    const handleRate = (rating: Ratings) => {
        startTransition(() => {
            upsertUserRating(userId, gameId, rating);
        });
    };

    return (
        <div className="flex flex-col gap-1 items-start">
            <div className="text-gray-400 text-lg">
                ⭐ {averageRating.toFixed(1)} ({ratingCount} ratings)
            </div>
            <div className="flex gap-0.5">
                {([1, 2, 3, 4, 5] as Ratings[]).map((i) => (
                    <span
                        key={i}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => {
                            setTempUserRating(i);
                            handleRate(i);
                        }}
                        className="cursor-pointer"
                    >
                        {renderStar(i)}
                    </span>
                ))}
            </div>
        </div>
    );
}
