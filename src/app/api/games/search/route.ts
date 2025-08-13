import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/app/utils/apiUtils";
import { searchGamesByName } from "@/db/games";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const gameName = url.searchParams.get("name");
    const limit = parseInt(url.searchParams.get("limit") ?? "10");

    if (!gameName) {
        return jsonError("No game name provided", 400);
    }

    if (limit < 1) {
        return jsonError("Invalid limit, must be over 1", 400);
    }

    try {
        const results = await searchGamesByName(gameName, limit);
        return NextResponse.json(results);
    } catch (error) {
        return jsonError(String(error), 500);
    }
}
