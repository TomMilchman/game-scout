import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard"]);

export default clerkMiddleware(async (auth, req) => {
    if (process.env.SKIP_AUTH === "true") {
        return NextResponse.next();
    }

    const { userId, redirectToSignIn } = await auth();

    if (req.nextUrl.pathname.startsWith("/api") && !userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!userId && isProtectedRoute(req)) {
        return redirectToSignIn();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
