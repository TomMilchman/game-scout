"use client";

import { FC, SVGProps } from "react";
import { FaSteam } from "react-icons/fa";
import { SiGogdotcom } from "react-icons/si";
import { GMGIcon } from "./gmgIcon";
import { GamePriceDetails } from "@/app/types";

export default function GamePricesClient({
    prices,
}: {
    prices: GamePriceDetails[];
}) {
    if (!prices.length)
        return (
            <p className="flex justify-center mb-3 text-gray-400">
                No prices available.
            </p>
        );

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
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
                            {Icon && <Icon className="w-6 h-6 mr-2" />}
                            <span className="font-semibold text-white">
                                {priceData.store}
                            </span>
                        </div>
                        <div className="text-right">
                            {priceData.current_price < priceData.base_price ? (
                                <>
                                    <span className="line-through text-gray-400 mr-2">
                                        {priceData.base_price}
                                    </span>
                                    <span className="text-green-400 font-bold">
                                        {Number(priceData.current_price) === 0
                                            ? "Free"
                                            : priceData.current_price}
                                    </span>
                                </>
                            ) : (
                                <span className="text-white">
                                    {Number(priceData.current_price) === 0
                                        ? "Free"
                                        : priceData.current_price}
                                </span>
                            )}
                        </div>
                    </a>
                );
            })}
        </div>
    );
}
