import { Game } from "@/app/types";

export default function GameSearchRow({ game }: { game: Game }) {
    return <div>{game.title}</div>;
}
