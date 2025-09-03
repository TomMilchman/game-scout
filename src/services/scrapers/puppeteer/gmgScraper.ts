import { GamePriceDetails } from "@/app/types";
import { getCluster } from "@/lib/puppeteer";
import { generateGameSlug } from "@/utils/generalUtils";
import { Page } from "puppeteer";

export async function scrapeGMGPrice(title: string, gameId: number) {
    const cluster = await getCluster();
    const slug = generateGameSlug(title, "-");
    let url = `https://www.greenmangaming.com/games/${slug}-pc`;

    return cluster.execute(async ({ page }: { page: Page }) => {
        try {
            let response = await page.goto(url, {
                waitUntil: "domcontentloaded",
            });

            if (
                !response ||
                !response.ok() ||
                page.url().includes("title-no-longer-available")
            ) {
                url = `https://www.greenmangaming.com/games/${slug}`;
                response = await page.goto(url, {
                    waitUntil: "domcontentloaded",
                });

                if (
                    !response ||
                    !response.ok() ||
                    page.url().includes("title-no-longer-available")
                ) {
                    return null;
                }
            }

            const ageModal = await page.$("div#birth-date-modal");

            if (ageModal) {
                await page.select("select#day", "01");
                await page.select("select#month", "01");
                await page.select("select#year", "2000");
                await page.click("btn.btn-success");
                await page.waitForNavigation();
            }

            const { basePrice, currentPrice, currency } = await page.evaluate(
                () => {
                    const prevEl = document.querySelector(
                        "gmgprice.prev-price"
                    );
                    const currEl =
                        document.querySelector("gmgprice.current-price") ||
                        prevEl;

                    const parsePrice = (el: Element | null) => {
                        if (!el) return null;
                        return parseFloat(
                            el.textContent?.replace(/[^0-9.]/g, "") || "0"
                        );
                    };

                    const base = parsePrice(prevEl) || parsePrice(currEl);
                    const current = parsePrice(currEl);

                    return {
                        basePrice: base,
                        currentPrice: current,
                        currency: "USD",
                    };
                }
            );

            return {
                game_id: gameId,
                store: "GreenManGaming",
                base_price: basePrice,
                current_price: currentPrice,
                currency,
                url,
                last_updated: new Date(),
            } as GamePriceDetails;
        } catch (error) {
            console.warn(`Failed to navigate to ${url}: ${error}`);
            return null;
        }
    });
}
