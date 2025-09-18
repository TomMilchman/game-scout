"use client";

import { toggleWishlist } from "@/app/server/games";
import { UserGameStatus } from "@/app/types";
import { useState } from "react";

interface WishlistButtonProps {
    gameId: number;
    status: UserGameStatus;
    isWishlisted: boolean | null;
    onToggle?: (newState: boolean) => void;
}

export default function WishlistButton({
    gameId,
    status,
    isWishlisted,
    onToggle,
}: WishlistButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClick = async () => {
        if (isWishlisted === null) return;

        setError(null);
        setLoading(true);

        try {
            const result = await toggleWishlist(gameId, isWishlisted);

            if (!result.success) {
                throw new Error(result.error ?? "Failed to toggle wishlist");
            }

            if (result.data !== undefined) {
                onToggle?.(result.data);
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error("Wishlist toggle failed:", message);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (status !== "Never Played") return null;

    let label: string;
    let disabled = loading;

    if (isWishlisted === true) {
        label = "Remove from Wishlist";
    } else if (isWishlisted === false) {
        label = "Add to Wishlist";
    } else {
        label = "Wishlist unavailable";
        disabled = true;
    }

    return (
        <div>
            <button
                type="button"
                onClick={handleClick}
                disabled={disabled}
                className={`
                    px-6 py-1 sm:py-2 font-semibold rounded-lg shadow-md transition
                    ${
                        disabled
                            ? "bg-gray-500"
                            : "bg-gray-600 hover:bg-gray-700"
                    }
                    text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    hover:shadow-lg text-xs sm:text-sm
                `}
            >
                {loading ? "Processing..." : label}
            </button>
            {error && <p className="text-red-500 mt-1">{error}</p>}
        </div>
    );
}
