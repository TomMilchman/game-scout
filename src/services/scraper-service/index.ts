import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { scrapeGMGPrice } from "./scrapers/gmgScraper";
import { scrapeGogPrice } from "./scrapers/gogScraper";

const PORT = process.env.PORT || 4000;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/scrape", async (req, res) => {
    const { store, title, gameId } = req.body;

    try {
        let data = null;

        switch (store) {
            case "GreenManGaming":
                data = await scrapeGMGPrice(title, gameId);
                break;
            case "GOG":
                data = await scrapeGogPrice(title, gameId);
                break;
            default:
                return res
                    .status(400)
                    .json({ success: false, error: "Unknown store" });
        }

        res.json({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error });
    }
});

app.listen(PORT, () => console.log(`Scraper service running on port ${PORT}`));
