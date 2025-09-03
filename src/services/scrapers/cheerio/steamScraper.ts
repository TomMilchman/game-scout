import * as cheerio from "cheerio";

export async function scrapeSteamSearch(
    query: string,
    limit: number,
    existingIds: Set<number> = new Set()
) {
    const formatted = query.replace(/ /g, "+");
    const url = `https://store.steampowered.com/search/?term=${formatted}`;
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const gameIds: number[] = [];

    $("a.search_result_row").each((_, el) => {
        const href = $(el).attr("href");
        const match = href?.match(/app\/(\d+)/);

        if (match) {
            const id = parseInt(match[1]);

            if (!existingIds.has(id)) {
                gameIds.push(id);
            }
        }

        if (gameIds.length >= limit) return false;
    });

    return gameIds;
}
