import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col text-center mt-4 gap-2.5 items-center">
            <div className="text-5xl text-slate-600">GameScout</div>
            <div className="text-md text-slate-400">
                Track Game Progress | Scout Game Prices Across Different
                Storefronts | Wishlist Games
            </div>
            <div className="flex gap-2">
                <SignedOut>
                    <Link href="/auth/log-in">
                        <button className="px-2 py-1 text-sm border border-neutral-300 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700 cursor-pointer">
                            Log In
                        </button>
                    </Link>
                    <Link href="/auth/sign-up">
                        <button className="px-2 py-1 text-sm border border-neutral-300 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700 cursor-pointer">
                            Sign Up
                        </button>
                    </Link>
                </SignedOut>
                <SignedIn>
                    <Link href="/dashboard">
                        <button className="px-2 py-1 text-sm border border-neutral-300 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700 cursor-pointer">
                            Go To Dashboard
                        </button>
                    </Link>
                </SignedIn>
            </div>
        </div>
    );
}
