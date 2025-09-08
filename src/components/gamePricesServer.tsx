import GamePricesClient from "./gamePricesClient";
import { fetchPricesForGames } from "@/app/server/games";

export default async function GamePricesServer({
    gameId,
    title,
    steamAppId,
}: {
    gameId: number;
    title: string;
    steamAppId: number;
}) {
    const result = await fetchPricesForGames([{ gameId, title, steamAppId }]);

    const prices = result.success ? result.data?.[gameId] ?? [] : [];

    return <GamePricesClient prices={prices} />;
}
