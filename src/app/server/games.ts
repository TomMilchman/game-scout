"use server";

import { getGamesById, searchGamesByName, upsertGames } from "@/db/games";
import { scrapeSteamSearch } from "@/services/steam/steamScraper";
import { executeAction, normalizeQuery } from "@/utils/generalUtils";
import {
    fetchSteamPrice,
    fetchSteamGamesDetails,
} from "@/services/steam/steamApi";
import { ActionResult, Game, GamePriceDetails, UserGameStatus } from "../types";
import { getPricesForGames, upsertGamePrices } from "@/db/prices";
import { GameDetails } from "steamapi";
import { getUserGameStatus, upsertUserGameStatus } from "@/db/user_games";
import { addToWishlist, removeFromWishlist } from "@/db/wishlist";
import { fetchPrice } from "./prices";

const GAME_DETAILS_REFRESH_THRESHOLD_MS = 1000 * 60 * 60 * 24; // 1 day
const GAME_PRICE_REFRESH_THRESHOLD_MS = 1000 * 60 * 60; // 1 hour

/**
 * Fetch games for a search query (metadata only), handling missing and stale separately.
 */
export async function fetchGamesForSearchQuery(
    query: string,
    userId: string
): Promise<ActionResult<Game[]>> {
    return executeAction(async () => {
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
        const staleGamesDetailsAndIds = (
            await fetchStaleGamesDetails(games, Date.now())
        ).data;
        const staleGameDetails = staleGamesDetailsAndIds?.map((g) => g.details);

        if (staleGameDetails && staleGameDetails.length > 0) {
            gameDetails.push(...staleGameDetails);
        }

        // Step 6: Upsert new and stale games to DB
        await upsertGames(gameDetails);

        // Step 7: Re-fetch all games from DB to return
        games = await searchGamesByName(query, userId, limit);

        return games;
    });
}

async function fetchStaleGamesDetails(
    games: Game[],
    updateTime: number
): Promise<ActionResult<{ steam_app_id: number; details: GameDetails }[]>> {
    return executeAction(async () => {
        const staleGames = games.filter(
            (g) =>
                !g.last_updated ||
                updateTime - g.last_updated.getTime() >
                    GAME_DETAILS_REFRESH_THRESHOLD_MS
        );

        if (staleGames.length === 0) return [];

        const staleIds = staleGames.map((g) => g.steam_app_id);
        const detailsArray = await fetchSteamGamesDetails(staleIds);

        return staleGames.map((game, idx) => ({
            steam_app_id: game.steam_app_id,
            details: detailsArray[idx],
        }));
    });
}

export async function fetchGamesByIdsOrScrape(
    gameIds: number[],
    userId: string
): Promise<ActionResult<Game[]>> {
    return executeAction(async () => {
        const now = Date.now();
        const games = await getGamesById(gameIds, userId);

        const staleResult = await fetchStaleGamesDetails(games, now);

        if (!staleResult.success) {
            console.warn(
                "Failed to fetch stale game details:",
                staleResult.error
            );
            // Even if stale fetch fails, return the original games
            return games;
        }

        const updatedStaleGamesDetailsAndIds = staleResult.data;
        if (updatedStaleGamesDetailsAndIds?.length === 0) {
            return games;
        }

        // Map stale games by their ID for easy lookup
        const staleMap = new Map<number, GameDetails>();
        updatedStaleGamesDetailsAndIds?.forEach((g) => {
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
    });
}

/**
 * Fetch only prices for given game IDs.
 * Uses DB cache if fresh, otherwise scrapes from stores.
 */
export async function fetchPricesForGames(
    gameIdsAndTitles: { gameId: number; title: string; steamAppId: number }[]
): Promise<ActionResult<Record<number, GamePriceDetails[]>>> {
    return executeAction(async () => {
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

                const steamPrice = await fetchSteamPrice(gameId, steamAppId);
                if (steamPrice?.base_price != null)
                    scrapedPrices.push(steamPrice);

                const gogPrice = await fetchPrice({
                    store: "GOG",
                    title,
                    gameId,
                });
                if (gogPrice?.base_price != null) scrapedPrices.push(gogPrice);

                const gmgPrice = await fetchPrice({
                    store: "GreenManGaming",
                    title,
                    gameId,
                });
                if (gmgPrice?.base_price != null) scrapedPrices.push(gmgPrice);

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
    });
}

export async function changeUserGameStatus(
    userId: string,
    gameId: number,
    prevStatus: UserGameStatus,
    newStatus: UserGameStatus,
    changeDate: Date
): Promise<ActionResult<void>> {
    return executeAction(async () => {
        if (prevStatus === "Never Played") {
            await removeFromWishlist(userId, gameId);
        }

        await upsertUserGameStatus(userId, gameId, newStatus, changeDate);
    });
}

export async function toggleWishlist(
    userId: string,
    gameId: number,
    enabled: boolean
): Promise<ActionResult<boolean>> {
    return executeAction(async () => {
        const status = await getUserGameStatus(userId, gameId);

        if (status !== "Never Played") {
            throw new Error(
                "Can only toggle wishlist for games that have never been played"
            );
        }

        if (enabled) {
            await removeFromWishlist(userId, gameId);
            return false;
        } else {
            await addToWishlist(userId, gameId);
            return true;
        }
    });
}
