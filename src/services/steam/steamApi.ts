import { generateGameSlug } from "@/utils/generalUtils";
import { GamePriceDetails, PartialGameDetails } from "@/app/types";

export async function fetchSteamGamesDetails(steamAppIds: number[]) {
    if (!steamAppIds.length) return [];

    const results = await Promise.allSettled(
        steamAppIds.map((steamAppId) =>
            fetch(
                `https://store.steampowered.com/api/appdetails?appids=${steamAppId}&cc=us&l=en`
            ).then((res) => res.json())
        )
    );

    const validGames = results
        .map((result, index) => {
            if (result.status === "fulfilled") {
                const gameData = result.value[steamAppIds[index]]?.data;
                if (gameData && gameData.type === "game") {
                    return {
                        id: steamAppIds[index],
                        steam_app_id: gameData.steam_appid,
                        title: gameData.name,
                        description: gameData.short_description,
                        release_date: gameData.release_date?.date,
                        header_image: gameData.header_image,
                        capsule_image: gameData.capsule_image,
                    } as PartialGameDetails;
                }
            } else {
                console.error(
                    `Failed to fetch Steam game for id ${steamAppIds[index]}:`,
                    result.reason
                );
            }

            return null;
        })
        .filter((g) => g !== null);

    return validGames;
}

export async function fetchSteamPrice(gameId: number, steamAppId: number) {
    try {
        const res = await fetch(
            `https://store.steampowered.com/api/appdetails?appids=${steamAppId}&cc=us&l=en`
        );
        const data = await res.json();
        const gameDetails = data[steamAppId]?.data;

        if (!gameDetails) return null;

        const priceOverview = gameDetails.price_overview;

        return {
            game_id: gameId,
            store: "Steam",
            base_price: priceOverview
                ? Number(priceOverview.initial) / 100
                : gameDetails.is_free
                ? 0
                : null,
            current_price: priceOverview
                ? Number(priceOverview.final) / 100
                : gameDetails.is_free
                ? 0
                : null,
            currency: priceOverview?.currency,
            url: gameDetails.name
                ? `https://store.steampowered.com/app/${steamAppId}/${generateGameSlug(
                      gameDetails.name,
                      "_"
                  )}`
                : `https://store.steampowered.com/app/${steamAppId}`,
            last_updated: new Date(),
        } as GamePriceDetails;
    } catch (err) {
        console.error(
            `Failed to fetch Steam price for app ${steamAppId}:`,
            err
        );
        return null;
    }
}
