import { fetchGamesAndPricesAndScrapeIfNeeded } from "@/app/server/games";
import ChangeGameStatus from "@/components/changeGameStatus";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { FaSteam } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import { SiGogdotcom } from "react-icons/si";

export default async function GamePage({
    params,
}: {
    params: Promise<{ gameId: number }>;
}) {
    const { gameId } = await params;
    const { userId } = await auth();

    const game = (
        await fetchGamesAndPricesAndScrapeIfNeeded([gameId], userId || "")
    )[0];

    if (!game) {
        notFound();
    }

    const {
        title,
        description,
        type,
        release_date,
        header_image,
        status,
        game_prices,
    } = game;

    const hasBasePrice = game_prices
        ? game_prices.some((priceData) => priceData.base_price >= 0)
        : false;

    const canChangeStatus = release_date
        ? new Date(release_date) <= new Date()
        : false;

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
                    <h1 className="text-3xl md:text-5xl font-bold text-white">
                        {title}
                    </h1>
                    <p className="text-gray-300 mt-1 text-sm md:text-base">
                        Release Date: {release_date}
                    </p>
                </div>
                <div className="absolute top-4 right-4 z-10">
                    {type && (
                        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-600 text-white capitalize shadow-md">
                            {type}
                        </span>
                    )}
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
            {hasBasePrice && (
                <section className="bg-gray-800 rounded-lg p-6 shadow-md mb-6">
                    <h2 className="text-2xl font-semibold text-white mb-4">
                        Price Comparison
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {game_prices?.map((priceData) => {
                            let Icon: IconType;

                            switch (priceData.store) {
                                case "Steam":
                                    Icon = FaSteam;
                                    break;
                                case "GOG":
                                    Icon = SiGogdotcom;
                                    break;
                            }

                            return (
                                <a
                                    key={priceData.store}
                                    href={priceData.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg shadow hover:bg-gray-600 transition"
                                >
                                    <div className="flex items-center">
                                        {Icon && (
                                            <Icon className="w-6 h-6 mr-2" />
                                        )}
                                        <span className="font-semibold text-white">
                                            {priceData.store}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        {priceData.current_price <
                                        priceData.base_price ? (
                                            <>
                                                <span className="line-through text-gray-400 mr-2">
                                                    {priceData.base_price}
                                                </span>
                                                <span className="text-green-400 font-bold">
                                                    {Number(
                                                        priceData.current_price
                                                    ) === 0
                                                        ? "Free"
                                                        : priceData.current_price}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-white">
                                                {Number(
                                                    priceData.current_price
                                                ) === 0
                                                    ? "Free"
                                                    : priceData.current_price}
                                            </span>
                                        )}
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Bottom Buttons */}
            <section className="flex gap-4">
                {canChangeStatus && (
                    <ChangeGameStatus
                        initialStatus={status || "Never Played"}
                        gameId={gameId}
                        userId={userId || ""}
                    />
                )}
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition">
                    Add to Wishlist
                </button>
            </section>
        </div>
    );
}
