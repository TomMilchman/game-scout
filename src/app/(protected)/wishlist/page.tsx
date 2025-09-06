import { getWishlist } from "@/db/wishlist";
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
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-6">Your Wishlist</h1>
            <WishlistInteractiveGrid
                initialWishlist={wishlist}
                userId={userId}
            />
        </div>
    );
}
