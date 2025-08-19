import { getGames } from "@/app/server/games";
import { Game } from "@/app/types";
import GameSearchRow from "@/components/gameSearchRow";
import { auth } from "@clerk/nextjs/server";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ query: string; limit: number }>;
}) {
    const { userId } = await auth();
    const { query, limit } = await searchParams;

    const games: Game[] = await getGames(query || "", userId || "", limit);

    return (
        <div className="flex flex-col gap-2 mx-auto max-w-full mt-3">
            {games.map((game) => (
                <GameSearchRow
                    key={game.id}
                    game={game}
                    userId={userId || ""}
                />
            ))}
        </div>
    );
}
