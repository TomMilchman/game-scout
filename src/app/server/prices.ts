import { GamePriceDetails } from "../types";
import { scrapeGogPrice } from "@/services/scraper-service/scrapers/gogScraper";
import { scrapeGMGPrice } from "@/services/scraper-service/scrapers/gmgScraper";

type Store = "GreenManGaming" | "GOG";

interface FetchPriceOptions {
    store: Store;
    title: string;
    gameId: number;
    localScraper?: (title: string, gameId: number) => Promise<GamePriceDetails>;
}

export async function fetchPrice({ store, title, gameId }: FetchPriceOptions) {
    if (process.env.NODE_ENV === "production") {
        const res = await fetch(`${process.env.SCRAPER_URL}/scrape`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ store, title, gameId }),
        });
        const data = await res.json();
        return data;
    } else {
        switch (store) {
            case "GOG":
                return await scrapeGogPrice(title, gameId);
            case "GreenManGaming":
                return await scrapeGMGPrice(title, gameId);
            default:
                throw new Error("Store not supported");
        }
    }
}
