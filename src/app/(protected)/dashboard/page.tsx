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
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-4xl font-bold text-white mb-6">My Games</h1>
            <StatusSections gamesByStatus={gamesByStatus} userId={userId} />
        </div>
    );
}
