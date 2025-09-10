export type ActionResult<T = undefined> = {
    success: boolean;
    error?: string;
    data?: T;
};

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
    status_change_date: Date | null;
    last_updated: Date;
    average_rating: number;
    rating_count: number;
    user_rating: number | null;
}

export type StoreName = "Steam" | "GOG" | "GreenManGaming";

export interface GamePriceDetails {
    game_id: number;
    store: StoreName;
    base_price: number;
    current_price: number;
    currency: string | undefined;
    url: string;
    last_updated: Date;
}

export type Ratings = 1 | 2 | 3 | 4 | 5;
