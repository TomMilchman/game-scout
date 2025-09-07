import { fetchGamesForSearchQuery } from "@/app/server/games";
import GameSearchClientWrapper from "@/components/gameSearchClientWrapper";
import { areGamesInUserWishlist } from "@/db/wishlist";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ query: string; limit: number }>;
}) {
    const { userId } = await auth();
    const { query } = await searchParams;

    if (!userId) {
        redirect("/auth/log-in");
    }

    const result = await fetchGamesForSearchQuery(query || "", userId);

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

    const wishlistStatusByGameId = await areGamesInUserWishlist(
        userId,
        gameIds
    );

    return (
        <div>
            <GameSearchClientWrapper
                games={games}
                userId={userId}
                wishlistStatusByGameId={wishlistStatusByGameId}
            />
        </div>
    );
}
