import {
    countGamesByQuery,
    getGameAndPricesById,
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
import { upsertGamePrices } from "@/db/prices";
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

export async function fetchGameAndItsPrices(gameId: number, userId: string) {
    try {
        let game = await getGameAndPricesById(gameId, userId);
        const last_updated = game.game_prices?.Steam?.last_updated;
        const ONE_HOUR_MS = 1000 * 60 * 60;

        if (
            !last_updated ||
            Date.now() - last_updated.getTime() > ONE_HOUR_MS
        ) {
            // Get prices from APIs and scraping
            const gamePriceDetailsAcrossStores: GamePriceDetails[] = [];

            const steamPriceDetails = await fetchSteamPrice(
                gameId,
                game.steam_app_id
            );

            if (steamPriceDetails.base_price !== null) {
                gamePriceDetailsAcrossStores.push(steamPriceDetails);
            }

            const gogPriceDetails = await scrapeGogPrice(game.title, gameId);

            if (gogPriceDetails && gogPriceDetails.base_price !== null) {
                gamePriceDetailsAcrossStores.push(gogPriceDetails);
            }

            // Upsert pricing to DB
            await upsertGamePrices(gamePriceDetailsAcrossStores);

            // Return an updated game object
            game = await getGameAndPricesById(gameId, userId);
        }

        return game;
    } catch (error) {
        console.error("fetchGameAndPricesById failed", error);
    }
}
