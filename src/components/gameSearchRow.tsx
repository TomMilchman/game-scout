import { Game } from "@/app/types";
import ChangeGameStatus from "./changeGameStatus";
import Link from "next/link";

export default function GameSearchRow({
    game,
    userId,
}: {
    game: Game;
    userId: string;
}) {
    const {
        id,
        type,
        title,
        release_date,
        status,
        capsule_image,
        header_image,
    } = game;

    return (
        <div className="flex items-center gap-4 bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition">
            {/* Game Image */}
            <Link href={`/game/${id}`}>
                <div className="w-40 md:w-56 aspect-[2.5/1] flex-shrink-0 rounded-lg overflow-hidden bg-black">
                    <img
                        src={capsule_image || header_image}
                        alt={title}
                        className="w-full h-full object-contain"
                    />
                </div>
            </Link>

            {/* Game Info */}
            <div className="flex flex-col justify-between flex-1">
                <div>
                    <Link href={`/game/${id}`}>
                        <h3 className="text-lg md:text-xl font-bold text-white hover:underline">
                            {title}
                        </h3>
                    </Link>
                    {type && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-700 text-gray-200">
                            {type}
                        </span>
                    )}

                    <p className="text-gray-400 text-sm md:text-base">
                        Released: {release_date}
                    </p>
                </div>

                {/* Status Selector */}
                <div className="mt-2 md:mt-4">
                    <ChangeGameStatus
                        initialStatus={status || "Never Played"}
                        gameId={game.id}
                        userId={userId}
                    />
                </div>
            </div>
        </div>
    );
}
