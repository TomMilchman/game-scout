import { currentUser } from "@clerk/nextjs/server";

export default async function Dashboard() {
    const userObj = await currentUser();

    return (
        <div>{`${userObj?.username ?? userObj?.firstName}'s dashboard`}</div>
    );
}
