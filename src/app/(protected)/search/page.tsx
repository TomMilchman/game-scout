import { fetchGames } from "@/app/server/games";
import { Game } from "@/app/types";
import GameSearchClientWrapper from "@/components/gameSearchClientWrapper";
import { auth } from "@clerk/nextjs/server";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ query: string; limit: number }>;
}) {
    const { userId } = await auth();
    const { query } = await searchParams;

    const games: Game[] = await fetchGames(query || "", userId || "");

    return (
        <div>
            <GameSearchClientWrapper games={games} userId={userId || ""} />
        </div>
    );
}
