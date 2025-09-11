import { Game } from "@/app/types";
import Link from "next/link";
import GameActions from "./gameActions";

export default function GameSearchRow({
    userId,
    game,
    initialWishlisted,
}: {
    userId: string;
    game: Game;
    initialWishlisted: boolean;
}) {
    const { id, title, release_date, status, capsule_image, header_image } =
        game;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-800 rounded-lg p-5 sm:p-4 shadow-md transition">
            {/* Game Image */}
            <Link href={`/game/${id}`}>
                <div className="w-64 md:w-56 aspect-[2.5/1] flex-shrink-0 rounded-lg overflow-hidden bg-black">
                    <img
                        src={capsule_image || header_image}
                        alt={title}
                        className="w-full h-full object-contain"
                    />
                </div>
            </Link>

            {/* Game Info */}
            <div className="flex flex-col justify-between flex-1 gap-0.5">
                <div>
                    <Link href={`/game/${id}`}>
                        <h3 className="text-lg md:text-xl font-bold text-white hover:underline">
                            {title}
                        </h3>
                    </Link>

                    <p className="text-gray-400 text-sm md:text-base">
                        Released: {release_date}
                    </p>
                </div>

                {/* Game Actions */}
                <div className="mt-2 md:mt-4 mb-6">
                    <GameActions
                        userId={userId}
                        game={game}
                        initialStatus={status || "Never Played"}
                        initialWishlisted={initialWishlisted}
                    />
                </div>
            </div>
        </div>
    );
}
