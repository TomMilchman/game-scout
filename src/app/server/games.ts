"use server";

import { getGamesById, searchGamesByName, upsertGames } from "@/db/games";
import { scrapeSteamSearch } from "@/services/scrapers/cheerio/steamScraper";
import { normalizeQuery } from "@/utils/generalUtils";
import {
    fetchSteamPrice,
    fetchSteamGamesDetails,
} from "@/services/steamAPI/steamApi";
import { Game, GamePriceDetails } from "../types";
import { getPricesForGames, upsertGamePrices } from "@/db/prices";
import { scrapeGogPrice } from "@/services/scrapers/puppeteer/gogScraper";
import { scrapeGMGPrice } from "@/services/scrapers/puppeteer/gmgScraper";
import { GameDetails } from "steamapi";

const GAME_DETAILS_REFRESH_THRESHOLD_MS = 1000 * 60 * 60 * 24; // 1 day
const GAME_PRICE_REFRESH_THRESHOLD_MS = 1000 * 60 * 60; // 1 hour

/**
 * Fetch games for a search query (metadata only), handling missing and stale separately.
 */
export async function fetchGamesForSearchQuery(query: string, userId: string) {
    try {
        query = normalizeQuery(query);
        const limit = 50;

        // Step 1: Fetch existing games from DB
        let games = await searchGamesByName(query, userId, limit);

        // Step 3: Determine how many games are missing
        const missingCount = limit - games.length;
        const gameDetails: GameDetails[] = [];

        // Step 4: Scrape missing games if needed
        if (missingCount > 0) {
            const existingIds = new Set(games.map((g) => g.steam_app_id));
            const scrapedIds = await scrapeSteamSearch(
                query,
                missingCount,
                existingIds
            );

            if (scrapedIds.length > 0) {
                const newGamesDetails = await fetchSteamGamesDetails(
                    scrapedIds
                );
                gameDetails.push(...newGamesDetails);
            }
        }

        // Step 5: Refresh stale games
        const staleGamesDetailsAndIds = await fetchStaleGamesDetails(
            games,
            Date.now()
        );
        const staleGameDetails = staleGamesDetailsAndIds?.map((g) => g.details);

        if (staleGameDetails && staleGameDetails.length > 0) {
            gameDetails.push(...staleGameDetails);
        }

        // Step 6: Upsert new and stale games to DB
        await upsertGames(gameDetails);

        // Step 7: Re-fetch all games from DB to return
        games = await searchGamesByName(query, userId, limit);

        return games;
    } catch (error) {
        console.error("fetchGamesForSearchQuery failed:", error);
        return [];
    }
}

async function fetchStaleGamesDetails(games: Game[], updateTime: number) {
    const staleGames = games.filter(
        (g) =>
            !g.last_updated ||
            updateTime - g.last_updated.getTime() >
                GAME_DETAILS_REFRESH_THRESHOLD_MS
    );

    if (staleGames.length > 0) {
        try {
            const staleIds = staleGames.map((g) => g.steam_app_id);
            const detailsArray = await fetchSteamGamesDetails(staleIds);

            const result = staleGames.map((game, idx) => ({
                steam_app_id: game.steam_app_id,
                details: detailsArray[idx],
            }));

            return result || [];
        } catch (err) {
            console.error("Failed to refresh stale games", err);
            return null;
        }
    }
}

export async function fetchGamesByIdsOrScrape(
    gameIds: number[],
    userId: string
) {
    try {
        const now = Date.now();
        const games = await getGamesById(gameIds, userId);
        const updatedStaleGamesDetailsAndIds = await fetchStaleGamesDetails(
            games,
            now
        );

        if (updatedStaleGamesDetailsAndIds) {
            // Map stale games by their ID for easy lookup
            const staleMap = new Map<number, GameDetails>();
            updatedStaleGamesDetailsAndIds.forEach((g) => {
                staleMap.set(g.steam_app_id, g.details);
            });

            // Replace stale games in the original array
            const mergedGames = games.map((game) =>
                staleMap.has(game.steam_app_id)
                    ? { ...game, ...staleMap.get(game.steam_app_id)! }
                    : game
            );

            // Upsert the newly fetched stale game details into DB
            await upsertGames(Array.from(staleMap.values()));

            return mergedGames;
        }

        return games;
    } catch (error) {
        console.error("fetchGamesByIdsOrScrape failed:", error);
        return [];
    }
}

/**
 * Fetch only prices for given game IDs.
 * Uses DB cache if fresh, otherwise scrapes from stores.
 */
export async function fetchPricesForGames(
    gameIdsAndTitles: { gameId: number; title: string; steamAppId: number }[]
) {
    try {
        const gameIds = gameIdsAndTitles.map((obj) => obj.gameId);

        // Fetch existing prices from DB
        const allPrices = await getPricesForGames(gameIds);
        const pricesByGameId = allPrices.reduce((acc, p) => {
            if (!acc[p.game_id]) acc[p.game_id] = [];
            acc[p.game_id].push(p);
            return acc;
        }, {} as Record<number, GamePriceDetails[]>);

        const now = Date.now();
        const updatedPrices: Record<number, GamePriceDetails[]> = {
            ...pricesByGameId,
        };

        // Helper to safely scrape
        async function safeScrape<T>(
            fn: () => Promise<T | null>,
            label: string
        ): Promise<T | null> {
            try {
                return await fn();
            } catch (err) {
                console.warn(`${label} scrape failed:`, err);
                return null;
            }
        }

        const scrapePromises = gameIdsAndTitles.map(
            async ({ gameId, title, steamAppId }) => {
                const prices = pricesByGameId[gameId];

                const latestUpdate = Math.max(
                    ...(prices?.map((p) => p.last_updated?.getTime() ?? 0) ?? [
                        0,
                    ])
                );

                const needsScrape =
                    !prices ||
                    prices.length === 0 ||
                    now - latestUpdate > GAME_PRICE_REFRESH_THRESHOLD_MS;

                if (!needsScrape) return;

                const scrapedPrices: GamePriceDetails[] = [];

                const steamPrice = await safeScrape(
                    () => fetchSteamPrice(gameId, steamAppId),
                    "Steam"
                );
                if (steamPrice?.base_price != null)
                    scrapedPrices.push(steamPrice);

                const gogPrice = await safeScrape(
                    () => scrapeGogPrice(title, gameId),
                    "GOG"
                );
                if (gogPrice?.base_price != null) scrapedPrices.push(gogPrice);

                const gmgPrice = await safeScrape(
                    () => scrapeGMGPrice(title, gameId),
                    "GreenManGaming"
                );
                if (gmgPrice?.base_price != null) scrapedPrices.push(gmgPrice);

                // Only insert valid prices
                const validPrices = scrapedPrices.filter(
                    (p) => p && p.game_id != null
                );

                if (validPrices.length > 0) {
                    await upsertGamePrices(validPrices);
                    updatedPrices[gameId] = validPrices;
                }
            }
        );

        await Promise.all(scrapePromises);

        return updatedPrices;
    } catch (error) {
        console.error("fetchPricesForGames failed:", error);
        return {};
    }
}
