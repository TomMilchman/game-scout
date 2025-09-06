"use client";

import { useState, useEffect } from "react";
import { fetchPricesForGames } from "@/app/server/games";
import { GamePriceDetails } from "@/app/types";
import { FC, SVGProps } from "react";
import { FaSteam } from "react-icons/fa";
import { SiGogdotcom } from "react-icons/si";
import { GMGIcon } from "@/components/gmgIcon";
import Spinner from "./spinner";

export default function GamePrices({
    gameId,
    title,
    steamAppId,
}: {
    gameId: number;
    title: string;
    steamAppId: number;
}) {
    const [prices, setPrices] = useState<GamePriceDetails[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrices = async () => {
            const data = await fetchPricesForGames([
                { gameId, title, steamAppId },
            ]);
            setPrices(data[gameId] || []);
            setLoading(false);
        };

        fetchPrices();
    }, [gameId, steamAppId, title]);

    return (
        <div>
            <section className="bg-gray-800 rounded-lg p-6 shadow-md mb-6">
                <h2 className="text-2xl font-semibold text-white mb-4">
                    Price Comparison
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center h-16">
                        <Spinner small={true} />
                    </div>
                ) : prices.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {prices.map((priceData) => {
                            let Icon: FC<SVGProps<SVGSVGElement>> | null = null;

                            switch (priceData.store) {
                                case "Steam":
                                    Icon = FaSteam;
                                    break;
                                case "GOG":
                                    Icon = SiGogdotcom;
                                    break;
                                case "GreenManGaming":
                                    Icon = GMGIcon;
                                    break;
                            }

                            return (
                                <a
                                    key={priceData.store}
                                    href={priceData.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg shadow hover:bg-gray-600 transition"
                                >
                                    <div className="flex items-center">
                                        {Icon && (
                                            <Icon className="w-6 h-6 mr-2" />
                                        )}
                                        <span className="font-semibold text-white">
                                            {priceData.store}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        {priceData.current_price <
                                        priceData.base_price ? (
                                            <>
                                                <span className="line-through text-gray-400 mr-2">
                                                    {priceData.base_price}
                                                </span>
                                                <span className="text-green-400 font-bold">
                                                    {Number(
                                                        priceData.current_price
                                                    ) === 0
                                                        ? "Free"
                                                        : priceData.current_price}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-white">
                                                {Number(
                                                    priceData.current_price
                                                ) === 0
                                                    ? "Free"
                                                    : priceData.current_price}
                                            </span>
                                        )}
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-400">No prices available.</p>
                )}
            </section>
        </div>
    );
}
