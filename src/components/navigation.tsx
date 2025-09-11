import { UserButton, SignedIn } from "@clerk/nextjs";
import SearchBar from "./searchbar";
import Link from "next/link";

export default function Navigation() {
    return (
        <nav className="fixed flex flex-col top-0 left-0 w-full z-50 bg-[var(--background)] border-b border-[var(--foreground)]/10">
            <div className="flex justify-between h-12 sm:h-16 items-center px-4">
                {/* Logo */}
                <Link href={"/dashboard"}>
                    <h1 className="text-lg sm:text-base md:text-xl font-extrabold text-white">
                        GameScout
                    </h1>
                </Link>

                {/* Center: Search (when larger than mobile screen) */}
                <div className="hidden sm:flex flex-1">
                    <SearchBar />
                </div>

                {/* Right: Wishlist + User */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/wishlist"
                        className="px-3 text-xs md:text-sm py-1.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
                    >
                        Wishlist
                    </Link>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
            <div className="sm:hidden w-full px-4 mb-2 max-w-full">
                <SearchBar />
            </div>
        </nav>
    );
}
