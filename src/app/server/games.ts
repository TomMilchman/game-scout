import {
    countGamesByQuery,
    getGamesById,
    searchGamesByName,
    upsertGames,
} from "@/db/games";
import { scrapeSteamSearch } from "@/services/scrapers/cheerio/steamScraper";
import { getCachedQuery, upsertCachedQuery } from "@/db/cached_queries";
import { normalizeQuery } from "@/utils/generalUtils";
import {
    fetchSteamPrice,
    fetchSteamGamesDetails,
} from "@/services/steamAPI/steamApi";
import { GamePriceDetails } from "../types";
import { getPricesForGames, upsertGamePrices } from "@/db/prices";
import { scrapeGogPrice } from "@/services/scrapers/puppeteer/gogScraper";

export async function fetchGames(query: string, userId: string) {
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

        const ONE_DAY_MS = 1000 * 60 * 60 * 24;
        const shouldScrape =
            (missingCount > 0 && !cachedQuery) ||
            (cachedQuery && currentCount < cachedQuery.total_games);
        const shouldRefresh =
            cachedQuery &&
            Date.now() - cachedQuery.scraped_at.getTime() > ONE_DAY_MS;

        let scrapeSucceeded = false;

        if (shouldRefresh || (shouldScrape && scrapeCount > 0)) {
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
    try {
        const gameIds = await scrapeSteamSearch(query, limit);
        const gamesDetails = await fetchSteamGamesDetails(gameIds);
        await upsertGames(gamesDetails);
    } catch (error) {
        console.error("scrapeAndChacheGames failed", error);
    }
}

export async function fetchGamesAndPricesAndScrapeIfNeeded(
    gameIds: number[],
    userId: string
) {
    try {
        const games = await getGamesWithPricesFromDB(gameIds, userId);

        if (!games || games.length === 0) {
            console.log("No games found in DB for provided ids");
            return [];
        }

        const ONE_HOUR_MS = 1000 * 60 * 60;
        const now = Date.now();

        const staleGames: typeof games = [];
        const freshGames: typeof games = [];

        for (const game of games) {
            const latestUpdate = Math.max(
                ...game.game_prices.map((p) => p.last_updated?.getTime() ?? 0)
            );

            if (now - latestUpdate > ONE_HOUR_MS) {
                staleGames.push(game);
            } else {
                freshGames.push(game);
            }
        }

        // Scrape stale games in parallel
        const scrapePromises = staleGames.map(async (game) => {
            const gamePriceDetailsAcrossStores: GamePriceDetails[] = [];

            const steamPriceDetails = await fetchSteamPrice(
                game.id,
                game.steam_app_id
            );
            if (steamPriceDetails.base_price !== null) {
                gamePriceDetailsAcrossStores.push(steamPriceDetails);
            }

            const gogPriceDetails = await scrapeGogPrice(game.title, game.id);
            if (gogPriceDetails && gogPriceDetails.base_price !== null) {
                gamePriceDetailsAcrossStores.push(gogPriceDetails);
            }

            if (gamePriceDetailsAcrossStores.length > 0) {
                await upsertGamePrices(gamePriceDetailsAcrossStores);
                game.game_prices = gamePriceDetailsAcrossStores;
            }

            return game;
        });

        const updatedStaleGames = await Promise.all(scrapePromises);

        // Return both fresh and updated stale games
        return [...freshGames, ...updatedStaleGames];
    } catch (error) {
        console.error("fetchGamesAndPricesAndScrapeIfNeeded failed", error);
        return [];
    }
}

async function getGamesWithPricesFromDB(gameIds: number[], userId: string) {
    const games = await getGamesById(gameIds, userId);

    const allPrices = await getPricesForGames(gameIds);
    const pricesByGameId = allPrices.reduce((acc, p) => {
        if (!acc[p.game_id]) {
            acc[p.game_id] = [];
        }

        acc[p.game_id].push(p);

        return acc;
    }, {} as Record<number, GamePriceDetails[]>);

    const gamesWithPrices = games.map((game) => ({
        ...game,
        game_prices: pricesByGameId[game.id] || [],
    }));

    return gamesWithPrices;
}
