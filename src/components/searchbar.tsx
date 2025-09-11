"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSearch = () => {
        startTransition(() => {
            router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
        });
    };

    return (
        <div className="flex gap-2 w-full md:max-w-md sm:max-w-sm mx-auto">
            <input
                type="search"
                name="searchBar"
                placeholder="Search Games"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch();
                    }
                }}
                className="flex-1 px-2 py-1 text-sm rounded-l-md
                sm:px-4 sm:py-2
                bg-gray-800 text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleSearch}
                className="px-2 py-1 text-sm rounded-r-md
                sm:px-4 sm:py-2 sm:text-base
                bg-purple-700 hover:bg-purple-800
                text-white font-semibold shadow-md
                transition flex items-center justify-center"
                disabled={isPending}
            >
                {isPending ? (
                    <div className="w-4 h-4 border-2 cursor border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <FaMagnifyingGlass />
                )}
            </button>
        </div>
    );
}
