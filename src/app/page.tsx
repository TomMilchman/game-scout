import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-center px-4">
            {/* Title */}
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-4">
                GameScout
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8">
                Track your game progress, scout prices across multiple
                storefronts, and manage your wishlist effortlessly.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
                <SignedOut>
                    <Link href="/auth/log-in">
                        <button className="px-6 py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition">
                            Log In
                        </button>
                    </Link>
                    <Link href="/auth/sign-up">
                        <button className="px-6 py-3 text-white font-semibold bg-green-600 hover:bg-green-700 rounded-lg shadow-md transition">
                            Sign Up
                        </button>
                    </Link>
                </SignedOut>
                <SignedIn>
                    <Link href="/dashboard">
                        <button className="px-6 py-3 text-white font-semibold bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md transition">
                            Go To Dashboard
                        </button>
                    </Link>
                </SignedIn>
            </div>
        </div>
    );
}
