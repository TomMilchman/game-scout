import { countGamesByQuery, searchGamesByName, upsertGames } from "@/db/games";
import { scrapeSteamSearch } from "@/services/scrapers/steamScraper";
import { steam } from "@/lib/steam";
import { getCachedQuery, upsertCachedQuery } from "@/db/cached_queries";
import { normalizeQuery } from "@/utils/generalUtils";
import { GameDetails } from "steamapi";

export async function getGames(query: string, userId: string) {
    try {
        query = normalizeQuery(query);
        const limit = 50;
        let games = await searchGamesByName(query, userId, limit);
        const currentCount = games.length;

        let cachedQuery = null;

        try {
            cachedQuery = await getCachedQuery(query);
        } catch (error) {
            console.warn(
                "Cache lookup failed, continuing without cache",
                error
            );
        }

        const missingCount = limit - currentCount;

        const scrapeCount = cachedQuery
            ? Math.max(cachedQuery.total_games - currentCount, 0)
            : missingCount;

        const ONE_HOUR_MS = 1000 * 60 * 60;
        const shouldScrape =
            (missingCount > 0 && !cachedQuery) ||
            (cachedQuery && currentCount < cachedQuery.total_games) ||
            (cachedQuery &&
                Date.now() - cachedQuery.scraped_at.getTime() > ONE_HOUR_MS);

        let scrapeSucceeded = false;

        if (shouldScrape && scrapeCount > 0) {
            try {
                await scrapeAndCacheGames(query, scrapeCount);
                games = await searchGamesByName(query, userId, limit);
                scrapeSucceeded = true;
            } catch (error) {
                console.error(
                    "Scraping failed, returning DB-only results:",
                    error
                );
            }

            if (scrapeSucceeded) {
                const totalKnown = await countGamesByQuery(query);
                await upsertCachedQuery(query, totalKnown);
            }
        }

        return games;
    } catch (error) {
        console.error("getGames failed:", error);
        return [];
    }
}

async function scrapeAndCacheGames(query: string, limit: number) {
    const gameIds = await scrapeSteamSearch(query, limit);

    try {
        const gameDetails = await Promise.allSettled(
            gameIds.map((id) => steam.getGameDetails(parseInt(id)))
        );

        const successfulGameDetails = gameDetails
            .filter((r) => r.status === "fulfilled")
            .map((r) => (r as PromiseFulfilledResult<GameDetails>).value);

        await upsertGames(successfulGameDetails);
    } catch (error) {
        console.error("scrapeAndChacheGames failed", error);
    }
}
