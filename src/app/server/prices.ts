import { signJwt } from "@/utils/jwtHandler";
import { GamePriceDetails } from "../types";

type Store = "GreenManGaming" | "GOG";

interface FetchPriceOptions {
    store: Store;
    title: string;
    gameId: number;
}

type ScrapeResult =
    | { success: true; data: GamePriceDetails }
    | { success: false; error: string };

export async function fetchPrice({
    store,
    title,
    gameId,
}: FetchPriceOptions): Promise<GamePriceDetails> {
    const token = signJwt();
    const res = await fetch(`${process.env.SCRAPER_URL}/scrape`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ store, title, gameId }),
    });
    const resObj: ScrapeResult = await res.json();

    if (resObj.success) {
        return resObj.data;
    } else {
        throw new Error(`On ${store}: ${resObj.error}`);
    }
}
