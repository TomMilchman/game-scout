export const dynamic = "force-dynamic";

import {
    checkIfGameIdsInUserWishlist,
    fetchGamesByIdsOrScrape,
} from "@/app/server/games";
import GamePricesServer from "@/components/gamePricesServer";
import { notFound } from "next/navigation";
import GameActions from "@/components/gameActions";
import { Suspense } from "react";
import Spinner from "@/components/spinner";

export default async function GamePage({
    params,
}: {
    params: Promise<{ gameId: number }>;
}) {
    const { gameId } = await params;

    const fetchGameResult = await fetchGamesByIdsOrScrape([gameId]);

    if (!fetchGameResult.success) {
        console.error("Failed to fetch game:", fetchGameResult.error);
        notFound();
    }

    const game = fetchGameResult.data?.[0];

    if (!game) {
        console.warn("Game not found for id:", gameId);
        notFound();
    }

    const isWishlistedResult = await checkIfGameIdsInUserWishlist([gameId]);

    let initialWishlisted: boolean | null = null;

    if (isWishlistedResult.success) {
        initialWishlisted = isWishlistedResult.data?.[gameId] ?? false;
    } else {
        console.error(
            `Error fetching wishlist status for game ID ${gameId}: ${isWishlistedResult.error}`
        );

        initialWishlisted = null;
    }

    const { title, steam_app_id, description, release_date, header_image } =
        game;

    return (
        <div className="max-w-5xl mx-auto mt-6 p-6">
            {/* Game Image + Title + Release Date */}
            <div className="w-full h-40 sm:h-64 md:h-96 relative rounded-lg overflow-hidden shadow-lg mb-6">
                <img
                    src={header_image || ""}
                    alt={title}
                    className="w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full h-8/12 sm:h-1/2 bg-gradient-to-t from-black/100 to-transparent" />
                <div className="absolute bottom-4 left-4 z-10">
                    <h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-white truncate">
                        {title}
                    </h1>
                    <p className="text-gray-300 mt-1 text-sm md:text-base">
                        Release: {release_date}
                    </p>
                </div>
            </div>

            {/* Interactive Elements */}
            <div className="mb-16">
                <GameActions
                    game={game}
                    initialStatus={game.status || "Never Played"}
                    initialWishlisted={initialWishlisted}
                />
            </div>

            {/* Description */}
            <section className="bg-gray-800 rounded-lg p-6 shadow-md mb-6">
                <h2 className="text-lg sm:text-2xl font-semibold text-white mb-3">
                    Description
                </h2>
                <p className="text-gray-300 leading-relaxed text-sm">
                    {description}
                </p>
            </section>

            {/* Game Prices Comparison */}
            <Suspense
                fallback={
                    <div className="flex justify-center items-center h-16">
                        <Spinner small={true} />
                    </div>
                }
            >
                <GamePricesServer
                    gameId={gameId}
                    title={title}
                    steamAppId={steam_app_id}
                />
            </Suspense>
        </div>
    );
}
