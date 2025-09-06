"use client";

import { UserGameStatus } from "@/app/types";
import { addToWishlist, removeFromWishlist } from "@/db/wishlist";
import { useState } from "react";

interface WishlistButtonProps {
    gameId: number;
    userId: string;
    status: UserGameStatus;
    isWishlisted: boolean;
    onToggle?: (newState: boolean) => void;
}

export default function WishlistButton({
    gameId,
    userId,
    status,
    isWishlisted,
    onToggle,
}: WishlistButtonProps) {
    const [enabled, setEnabled] = useState(isWishlisted);
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        const prev = enabled;
        setEnabled(!prev);
        setLoading(true);

        try {
            if (prev) {
                await removeFromWishlist(userId, gameId);
            } else {
                await addToWishlist(userId, gameId);
            }
            onToggle?.(!prev);
        } catch (error) {
            console.log(error);
            setEnabled(prev);
        } finally {
            setLoading(false);
        }
    };

    if (status !== "Never Played") {
        return null;
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={loading}
            className={`
        px-6 py-2 font-semibold rounded-lg shadow-md transition
        ${
            enabled
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-gray-600 hover:bg-gray-700 text-white"
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500
        hover:shadow-lg
      `}
        >
            {enabled ? "Remove from Wishlist" : "Add to Wishlist"}
        </button>
    );
}
