export type UserGameStatus =
    | "never-played"
    | "playing"
    | "on-hold"
    | "finished"
    | "completed"
    | "dropped";

export interface Game {
    id: number;
    steam_app_id: number;
    title: string;
    description: string;
    release_date: string | null;
    header_image: string | null;
    status: string | null;
}
