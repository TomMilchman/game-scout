"use client";

import { useState } from "react";
import ChangeGameStatus from "./changeGameStatus";
import WishlistButton from "./wishlistButton";
import { Game, UserGameStatus } from "@/app/types";

interface Props {
    initialStatus: UserGameStatus;
    initialWishlisted: boolean;
    game: Game;
    userId: string;
}

export default function GameActions({
    initialStatus,
    initialWishlisted,
    game,
    userId,
}: Props) {
    const [status, setStatus] = useState<UserGameStatus>(initialStatus);
    const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);

    const now = new Date();
    const released = new Date(game.release_date) <= now;

    return (
        <section className="flex gap-4 max-h-2">
            {released ? (
                <ChangeGameStatus
                    initialStatus={status}
                    gameId={game.id}
                    userId={userId}
                    onStatusChange={(newStatus) => {
                        setStatus(newStatus);

                        if (newStatus !== "Never Played") {
                            setIsWishlisted(false);
                        }
                    }}
                />
            ) : (
                <></>
            )}
            <WishlistButton
                status={status}
                isWishlisted={isWishlisted}
                gameId={game.id}
                userId={userId}
                onToggle={(newState) => setIsWishlisted(newState)}
            />
        </section>
    );
}
