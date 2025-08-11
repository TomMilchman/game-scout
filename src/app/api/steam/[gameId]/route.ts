import SteamAPI from "steamapi";
import { NextRequest, NextResponse } from "next/server";

const steam = new SteamAPI(process.env.STEAM_API_KEY || "");

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ gameId: number }> }
) {
    const { gameId } = await params;

    try {
        const gameData = await steam.getGameDetails(gameId);

        return NextResponse.json({ name: gameData.name });
    } catch {
        return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }
}
