import { getUserGames } from "@/db/user_games";
import { auth } from "@clerk/nextjs/server";
import StatusSections from "@/components/statusSections";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/auth/log-in");
    }

    const gamesByStatus = await getUserGames(userId);

    return (
        <div className="max-w-6xl mx-auto py-8 sm:pt-2 sm:pb-6 px-6">
            <StatusSections gamesByStatus={gamesByStatus} userId={userId} />
        </div>
    );
}
