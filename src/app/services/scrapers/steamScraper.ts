import { getBrowser, closeBrowser } from "@/lib/puppeteer";

export async function scrapeSteamGameIds(
    name: string,
    limit: number
): Promise<string[]> {
    if (limit < 1) {
        throw new Error("Limit must be at least 1");
    }

    const browser = await getBrowser();
    const page = await browser.newPage();
    const query = name.replace(" ", "+");
    const searchUrl = `https://store.steampowered.com/search/?term=${query}`;

    try {
        await page.goto(searchUrl, { waitUntil: "networkidle2" });

        const gameIds: (string | null)[] = await page.evaluate((limit) => {
            const items = Array.from(
                document.querySelectorAll("a.search_result_row")
            ).slice(0, limit + 1);

            return items.map((item) => {
                const href = (item as HTMLAnchorElement).href;
                const match = href.match(/app\/(\d+)/);
                return match ? match[1] : null;
            });
        }, limit);

        return gameIds.filter((id): id is string => id !== null);
    } catch (error) {
        console.error("Error scraping Steam game IDs:", error);
        throw error;
    } finally {
        await page.close();
        await closeBrowser();
    }
}
