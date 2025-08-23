import type { Page } from "puppeteer";
import { GamePriceDetails } from "@/app/types";
import { getCluster } from "@/lib/puppeteer";
import { generateGameSlug } from "@/utils/generalUtils";

export async function scrapeGogPrice(
    title: string,
    gameId: number
): Promise<GamePriceDetails | null> {
    const cluster = await getCluster();
    const slug = generateGameSlug(title);
    const url = `https://www.gog.com/en/game/${slug}`;

    return cluster.execute(async ({ page }: { page: Page }) => {
        try {
            const response = await page.goto(url, {
                waitUntil: "domcontentloaded",
            });

            if (!response || !response.ok()) return null;

            const { basePrice, discountedPrice, currency } =
                await page.evaluate(() => {
                    const baseEl = document.querySelector(
                        ".product-actions-price__base-amount"
                    );
                    const discountEl = document.querySelector(
                        ".product-actions-price__final-amount"
                    );

                    const parsePrice = (el: Element | null) => {
                        if (!el) return null;

                        return parseFloat(
                            el.textContent?.replace(/[^0-9.]/g, "") || "0"
                        );
                    };

                    const base = parsePrice(baseEl);
                    const final = parsePrice(discountEl);

                    return {
                        basePrice: base ?? final,
                        discountedPrice: base ? final : null,
                        currency: "USD",
                    };
                });

            return {
                game_id: gameId,
                store: "GOG",
                base_price: basePrice,
                current_price: discountedPrice,
                currency,
                url,
                last_updated: new Date(),
            };
        } catch (error) {
            console.warn(`Failed to navigate to ${url}: ${error}`);
            return null;
        }
    });
}
