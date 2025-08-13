import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/app/utils/apiUtils";
import { scrapeSteamGameIds } from "@/app/services/scrapers/steamScraper";
import { steam } from "@/lib/steam";
import { cacheGames } from "@/db/games";

export async function POST(req: NextRequest) {
    const url = new URL(req.url);
    const gameName = url.searchParams.get("name");
    const limit = parseInt(url.searchParams.get("limit") ?? "10");

    if (!gameName) return jsonError("No game name provided", 400);

    try {
        // Step 1: Scrape Steam for game IDs
        const gameIds = await scrapeSteamGameIds(gameName, limit);

        if (!gameIds || gameIds.length === 0) {
            return jsonError("No games found matching search query", 404);
        }

        // Step 2: Fetch details from Steam API
        const gameDetails = await Promise.all(
            gameIds.map(
                async (gameId) => await steam.getGameDetails(parseInt(gameId))
            )
        );

        // Step 3: Insert into DB
        const insertedGames = await cacheGames(gameDetails);

        return NextResponse.json(insertedGames);
    } catch (error) {
        return jsonError(String(error), 500);
    }
}
