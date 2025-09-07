"use client";

import { useState } from "react";
import ChangeGameStatus from "./changeGameStatus";
import WishlistButton from "./wishlistButton";
import { UserGameStatus } from "@/app/types";

interface Props {
    initialStatus: UserGameStatus;
    initialWishlisted: boolean;
    gameId: number;
    userId: string;
}

export default function GameActions({
    initialStatus,
    initialWishlisted,
    gameId,
    userId,
}: Props) {
    const [status, setStatus] = useState<UserGameStatus>(initialStatus);
    const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);

    return (
        <section className="flex gap-4">
            <ChangeGameStatus
                initialStatus={status}
                gameId={gameId}
                userId={userId}
                onStatusChange={(newStatus) => {
                    setStatus(newStatus);

                    if (newStatus !== "Never Played") {
                        setIsWishlisted(false);
                    }
                }}
            />
            <WishlistButton
                status={status}
                isWishlisted={isWishlisted}
                gameId={gameId}
                userId={userId}
                onToggle={(newState) => setIsWishlisted(newState)}
            />
        </section>
    );
}
