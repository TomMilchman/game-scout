import sql from "@/lib/db";

export interface CachedQuery {
    query: string;
    scraped_at: Date;
    total_games: number;
}

export async function getCachedQuery(query: string) {
    const rows = await sql`SELECT * FROM cached_queries WHERE query=${query}`;
    return (rows[0] as CachedQuery) || null;
}

export async function upsertCachedQuery(query: string, totalGames: number) {
    await sql`
    INSERT INTO cached_queries (query, scraped_at, total_games)
    VALUES (${query}, NOW(), ${totalGames})
    ON CONFLICT (query) DO 
    UPDATE SET
        scraped_at = EXCLUDED.scraped_at,
        total_games = EXCLUDED.total_games
    ;`;
}
