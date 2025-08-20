import { UserButton, SignedIn } from "@clerk/nextjs";
import SearchBar from "./searchbar";
import Link from "next/link";

export default function Navigation() {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-[var(--background)] border-b border-[var(--foreground)]/10">
            <div className="flex justify-between h-16 items-center px-4">
                <Link href={"/dashboard"}>
                    <h1 className="text-m md:text-xl font-extrabold text-white">
                        GameScout
                    </h1>
                </Link>
                <SearchBar />
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </nav>
    );
}
