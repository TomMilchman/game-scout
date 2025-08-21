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
                    VALUES (${gamePrice.game_id}, ${gamePrice.store}, ${gamePrice.base_price}, ${gamePrice.current_price}, ${gamePrice.currency}, ${gamePrice.url}, NOW())
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
