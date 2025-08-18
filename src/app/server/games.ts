import { countGamesByQuery, searchGamesByName, upsertGames } from "@/db/games";
import { scrapeSteamSearch } from "@/services/scrapers/steamScraper";
import { steam } from "@/lib/steam";
import { getCachedQuery, upsertCachedQuery } from "@/db/cached_queries";

export async function getGames(query: string, userId: string, limit = 10) {
    query = query
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/g, "");
    let games = await searchGamesByName(query, userId, limit);
    const currentCount = games.length;

    const cachedQuery = await getCachedQuery(query);
    const missingCount = limit - currentCount;

    const scrapeCount = cachedQuery
        ? Math.max(cachedQuery.total_games - currentCount, 0)
        : missingCount;

    const shouldScrape =
        (missingCount > 0 && !cachedQuery) ||
        (cachedQuery && currentCount < cachedQuery.total_games);

    if (shouldScrape && scrapeCount > 0) {
        await scrapeAndCacheGames(query, scrapeCount);
        games = await searchGamesByName(query, userId, limit);

        const totalKnown = await countGamesByQuery(query);
        await upsertCachedQuery(query, totalKnown);
    }

    return games;
}

export async function scrapeAndCacheGames(query: string, limit = 10) {
    const gameIds = await scrapeSteamSearch(query, limit);

    const gameDetails = await Promise.all(
        gameIds.map((id) => steam.getGameDetails(parseInt(id)))
    );

    await upsertGames(gameDetails);
}
