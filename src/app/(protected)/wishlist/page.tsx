import { getWishlist } from "@/db/wishlists";
import WishlistInteractiveGrid from "@/components/wishlistInteractiveGrid";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function WishlistPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/auth/log-in");
    }

    const wishlist = await getWishlist(userId);

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <h1 className="text-2xl sm:text-4xl font-bold mb-6">
                Your Wishlist
            </h1>
            <WishlistInteractiveGrid
                initialWishlist={wishlist}
                userId={userId}
            />
        </div>
    );
}
