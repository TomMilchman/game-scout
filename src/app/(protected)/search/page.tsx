import {
    checkIfGameIdsInUserWishlist,
    fetchGamesForSearchQuery,
} from "@/app/server/games";
import GameSearchClientWrapper from "@/components/gameSearchClientWrapper";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ query: string; limit: number }>;
}) {
    const { query } = await searchParams;

    if (query.length === 0) {
        return (
            <div className="text-2xl text-gray-500 italic text-center translate-y-1/2">
                No search term inserted
            </div>
        );
    }

    const result = await fetchGamesForSearchQuery(query);

    if (!result.success) {
        console.error("Failed to fetch games:", result.error);

        return (
            <p className="text-red-500">
                Failed to fetch games. Please try again later.
            </p>
        );
    }

    const games = result.data ?? [];
    const gameIds = games.map((g) => g.id);

    const wishlistStatusByGameIdResult = await checkIfGameIdsInUserWishlist(
        gameIds
    );

    return (
        <div>
            <GameSearchClientWrapper
                games={games}
                wishlistStatusByGameId={wishlistStatusByGameIdResult.data ?? {}}
            />
        </div>
    );
}
