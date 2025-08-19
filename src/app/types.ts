export const userGameStatuses = [
    "Never Played",
    "Playing",
    "On Hold",
    "Finished",
    "Completed",
    "Dropped",
] as const;

export type UserGameStatus = (typeof userGameStatuses)[number];

export interface Game {
    id: number;
    steam_app_id: number;
    title: string;
    description: string;
    release_date: string;
    header_image: string;
    capsule_image: string | null;
    status: UserGameStatus | null;
    type: string;
}
