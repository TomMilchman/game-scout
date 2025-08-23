import sql from "@/lib/db";
import { GameDetails } from "steamapi";
import { Game, GamePriceDetails, StoreName } from "@/app/types";

const normalize = (gameName: string) => gameName.replace(/[\s-]+/g, "%");

export async function getGameAndPricesById(gameId: number, userId: string) {
    const rows = await sql`
        SELECT g.*, ug.status, p.*
        FROM games g
        LEFT JOIN user_games ug
            ON ug.game_id = g.id
            AND ug.user_id = ${userId}
        LEFT JOIN prices p
            ON p.game_id = g.id
        WHERE g.id = ${gameId};
        `;

    const prices = rows.reduce<Partial<Record<StoreName, GamePriceDetails>>>(
        (acc, r) => {
            const store = r.store as StoreName;
            acc[store] = {
                game_id: r.game_id,
                store,
                base_price: parseFloat(r.base_price),
                current_price: parseFloat(r.current_price),
                currency: r.currency,
                url: r.url,
                last_updated: r.last_updated,
            } as GamePriceDetails;
            return acc;
        },
        {}
    );

    const game =
        rows[0] &&
        ({
            id: rows[0].id,
            steam_app_id: rows[0].steam_app_id,
            title: rows[0].title,
            description: rows[0].description,
            release_date: rows[0].release_date,
            header_image: rows[0].header_image,
            capsule_image: rows[0].capsule_image,
            type: rows[0].type,
            status: rows[0].status,
            game_prices: { ...prices },
        } as Game);

    return game;
}

export async function searchGamesByName(
    query: string,
    userId: string,
    limit: number
) {
    const normalized = normalize(query);

    return (await sql`
        SELECT g.*, ug.status
        FROM games g
        LEFT JOIN user_games ug
            ON ug.game_id = g.id
            AND ug.user_id = ${userId}
        WHERE g.title ILIKE ${"%" + normalized + "%"}
        LIMIT ${limit};
        `) as Game[];
}

export async function upsertGames(games: GameDetails[]) {
    await Promise.all(
        games.map(
            (game) =>
                sql`
                    INSERT INTO games (steam_app_id, title, description, type, release_date, header_image, capsule_image)
                    VALUES (${game.id}, ${game.name}, ${game.shortDescription}, ${game.type}, ${game.releaseDate?.date}, ${game.headerImage}, ${game.capsuleImage})
                    ON CONFLICT (steam_app_id) DO
                    UPDATE SET
                        title = EXCLUDED.title,
                        description = EXCLUDED.description,
                        type = EXCLUDED.type,
                        header_image = EXCLUDED.header_image,
                        capsule_image = EXCLUDED.capsule_image
                `
        )
    );
}

export async function countGamesByQuery(query: string): Promise<number> {
    const normalized = normalize(query);

    const result = await sql`
        SELECT COUNT(*)::int AS count
        FROM games
        WHERE title ILIKE ${`%${normalized}%`}
    `;

    return result[0]?.count ?? 0;
}
