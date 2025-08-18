import * as cheerio from "cheerio";

export async function scrapeSteamSearch(query: string, limit: number) {
    const formatted = query.replace(" ", "+");
    const url = `https://store.steampowered.com/search/?term=${formatted}`;
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const gameIds: string[] = [];
    $("a.search_result_row").each((i, el) => {
        if (i >= limit) return false;

        const href = $(el).attr("href");
        const match = href?.match(/app\/(\d+)/);

        if (match) {
            gameIds.push(match[1]);
        }
    });

    return gameIds;
}
