"use client";

import { useState } from "react";
import ChangeGameStatus from "./changeGameStatus";
import WishlistButton from "./wishlistButton";
import { FullGameDetails, UserGameStatus } from "@/app/types";
import { InteractiveStarRating } from "./interactiveStarRating";

interface Props {
    initialStatus: UserGameStatus;
    initialWishlisted: boolean | null;
    game: FullGameDetails;
}

export default function GameActions({
    initialStatus,
    initialWishlisted,
    game,
}: Props) {
    const [status, setStatus] = useState<UserGameStatus>(initialStatus);
    const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);

    const now = new Date();
    const released = new Date(game.release_date) <= now;

    return (
        <section className="flex gap-4 max-h-2 mb-4">
            <InteractiveStarRating
                gameId={game.id}
                averageRating={Number(game.average_rating)}
                ratingCount={Number(game.rating_count)}
                userRating={game.user_rating || 0}
            />
            <div className="flex flex-col sm:flex-row text-sm sm:text-base gap-2">
                {released ? (
                    <ChangeGameStatus
                        initialStatus={status}
                        gameId={game.id}
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
                    onToggle={(newState) => setIsWishlisted(newState)}
                />
            </div>
        </section>
    );
}
