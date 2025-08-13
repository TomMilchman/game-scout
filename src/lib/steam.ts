import SteamAPI from "steamapi";

export const steam = new SteamAPI(process.env.STEAM_API_KEY || "");
