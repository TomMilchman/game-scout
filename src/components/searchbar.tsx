"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

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
        <div className="flex gap-2 w-full max-w-md mx-auto">
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
                className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-r-lg shadow-md transition flex items-center justify-center"
                disabled={isPending}
            >
                {isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    "Search"
                )}
            </button>
        </div>
    );
}
