import ChangeGameStatus from "@/components/changeGameStatus";
import { getGameById } from "@/db/games";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function GamePage({
    params,
}: {
    params: Promise<{ gameId: number }>;
}) {
    const { gameId } = await params;
    const { userId } = await auth();

    const game = await getGameById(gameId, userId || "");

    if (!game) {
        notFound();
    }

    const { title, description, type, release_date, header_image, status } =
        game;

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Game Image + Title + Release Date */}
            <div className="w-full h-64 md:h-96 relative rounded-lg overflow-hidden shadow-lg mb-6">
                <img
                    src={header_image || ""}
                    alt={title}
                    className="w-full h-ful>l object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/100 to-transparent" />
                <div className="absolute bottom-4 left-4 z-10">
                    <h1 className="text-3xl md:text-5xl font-bold text-white">
                        {title}
                    </h1>
                    <p className="text-gray-300 mt-1 text-sm md:text-base">
                        Released: {release_date}
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

            {/* Bottom Buttons */}
            <section className="flex gap-4">
                <ChangeGameStatus
                    initialStatus={status || "Never Played"}
                    gameId={gameId}
                    userId={userId || ""}
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition">
                    Add to Wishlist
                </button>
            </section>
        </div>
    );
}
