import { SignIn, SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ClerkCatchAll({
    params,
}: {
    params: Promise<{ clerk?: string[] }>;
}) {
    const { userId } = await auth();

    if (userId) {
        redirect("/dashboard");
    }

    const path = (await params).clerk?.[0];

    if (path === "sign-up") {
        return <SignUp forceRedirectUrl="/dashboard" />;
    }

    return <SignIn forceRedirectUrl="/dashboard" />;
}
