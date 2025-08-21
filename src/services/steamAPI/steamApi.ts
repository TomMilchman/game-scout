import { GamePriceDetails } from "@/app/types";
import { steam } from "@/lib/steam";
import { GameDetails } from "steamapi";

export async function fetchSteamGamesDetails(gameIds: number[]) {
    const gamesDetails = await Promise.allSettled(
        gameIds.map((id) => steam.getGameDetails(id))
    );

    return gamesDetails
        .filter((r) => r.status === "fulfilled")
        .map((r) => (r as PromiseFulfilledResult<GameDetails>).value);
}

export async function fetchGamePriceFromSteam(
    gameId: number,
    steamAppId: number
) {
    const gameDetails = await steam.getGameDetails(steamAppId);
    const priceOverview = gameDetails.priceOverview;
    return {
        game_id: gameId,
        store: "Steam",
        base_price: priceOverview ? priceOverview.initial / 100 : 0,
        current_price: priceOverview ? priceOverview.final / 100 : 0,
        currency: priceOverview ? priceOverview.currency : undefined,
        url: gameDetails.website,
        last_updated: new Date(),
    } as GamePriceDetails;
}
