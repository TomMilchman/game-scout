import { fetchGamesByIdsOrScrape } from "@/app/server/games";
import GamePrices from "@/components/gamePrices";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isGameInUserWishlist } from "@/db/wishlist";
import GameActions from "@/components/gameActions";

export default async function GamePage({
    params,
}: {
    params: Promise<{ gameId: number }>;
}) {
    const { gameId } = await params;
    const { userId } = await auth();

    if (!userId) {
        redirect("/auth/log-in");
    }

    const result = await fetchGamesByIdsOrScrape([gameId], userId);

    if (!result.success) {
        console.error("Failed to fetch game:", result.error);
        notFound();
    }

    const game = result.data?.[0];

    if (!game) {
        console.warn("Game not found for id:", gameId);
        notFound();
    }

    const isWishlisted = await isGameInUserWishlist(userId, gameId);
    const { title, steam_app_id, description, release_date, header_image } =
        game;

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Game Image + Title + Release Date */}
            <div className="w-full h-64 md:h-96 relative rounded-lg overflow-hidden shadow-lg mb-6">
                <img
                    src={header_image || ""}
                    alt={title}
                    className="w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/100 to-transparent" />
                <div className="absolute bottom-4 left-4 z-10">
                    <h1 className="text-3xl md:text-5xl font-bold text-white truncate">
                        {title}
                    </h1>
                    <p className="text-gray-300 mt-1 text-sm md:text-base">
                        Release: {release_date}
                    </p>
                </div>
            </div>

            {/* Description */}
            <section className="bg-gray-800 rounded-lg p-6 shadow-md mb-6">
                <h2 className="text-2xl font-semibold text-white mb-3">
                    Description
                </h2>
                <p className="text-gray-300 leading-relaxed">{description}</p>
            </section>

            {/* Game Prices Comparison */}
            <Suspense>
                <GamePrices
                    gameId={gameId}
                    title={title}
                    steamAppId={steam_app_id}
                />
            </Suspense>

            {/* Bottom Buttons */}
            <GameActions
                gameId={game.id}
                userId={userId}
                initialStatus={game.status || "Never Played"}
                initialWishlisted={isWishlisted}
            />
        </div>
    );
}
