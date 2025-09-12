"use client";

import { useState } from "react";
import WishlistCard from "@/components/wishlistCard";
import { FullGameDetails } from "@/app/types";

interface Props {
    initialWishlist: FullGameDetails[];
    userId: string;
}

export default function WishlistInteractiveGrid({
    initialWishlist,
    userId,
}: Props) {
    const [wishlist, setWishlist] = useState(initialWishlist);

    const handleRemove = (gameId: number) => {
        setWishlist((prev) => prev.filter((g) => g.id !== gameId));
    };

    if (wishlist.length === 0) {
        return (
            <p className="text-center mt-20 text-gray-400">
                Your wishlist is empty.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((game) => (
                <WishlistCard
                    key={game.id}
                    game={game}
                    userId={userId}
                    onRemove={handleRemove}
                />
            ))}
        </div>
    );
}
