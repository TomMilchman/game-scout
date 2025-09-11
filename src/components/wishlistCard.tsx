"use client";

import { Game } from "@/app/types";
import WishlistButton from "./wishlistButton";
import Link from "next/link";

interface Props {
    game: Game;
    userId: string;
    onRemove?: (gameId: number) => void;
}

export default function WishlistCard({ game, userId, onRemove }: Props) {
    const handleToggle = (newState: boolean) => {
        if (!newState && onRemove) {
            onRemove(game.id);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <Link href={`/game/${game.id}`}>
                <img
                    src={game.header_image || ""}
                    alt={game.title}
                    className="w-full h-48 object-cover"
                />
            </Link>

            <div className="p-4 flex flex-col justify-between h-48">
                <div>
                    <Link href={`/game/${game.id}`}>
                        <h2 className="text-xl font-semibold text-white hover:underline">
                            {game.title}
                        </h2>
                    </Link>

                    <p className="text-gray-400 text-sm">
                        Release: {game.release_date || "TBD"}
                    </p>
                </div>
                <div className="flex items-center justify-center mt-4">
                    <WishlistButton
                        userId={userId}
                        gameId={game.id}
                        status={game.status || "Never Played"}
                        isWishlisted={true}
                        onToggle={handleToggle}
                    />
                </div>
            </div>
        </div>
    );
}
