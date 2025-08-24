import sql from "@/lib/db";
import { GamePriceDetails } from "@/app/types";

export async function upsertGamePrices(
    gamePricesDetailsAcrossStores: GamePriceDetails[]
) {
    await Promise.all(
        gamePricesDetailsAcrossStores.map(
            (gamePrice) =>
                sql`
                    INSERT INTO prices (game_id, store, base_price, current_price, currency, url, last_updated)
                    VALUES (${gamePrice.game_id}, ${gamePrice.store}, ${gamePrice.base_price}, ${gamePrice.current_price}, ${gamePrice.currency}, ${gamePrice.url}, ${gamePrice.last_updated})
                    ON CONFLICT (game_id, store) DO
                    UPDATE SET
                        base_price = EXCLUDED.base_price,
                        current_price = EXCLUDED.current_price,
                        currency = EXCLUDED.currency,
                        url = EXCLUDED.url,
                        last_updated = EXCLUDED.last_updated
                ;`
        )
    );
}

export async function getPricesForGames(gameIds: number[]) {
    const rows = await sql`
    SELECT * FROM prices
    WHERE game_id = ANY(${gameIds})
  `;

    const prices: GamePriceDetails[] = rows.map((r) => ({
        game_id: r.game_id,
        store: r.store,
        base_price: parseFloat(r.base_price),
        current_price: parseFloat(r.current_price),
        currency: r.currency,
        url: r.url,
        last_updated: r.last_updated,
    }));

    return prices;
}
