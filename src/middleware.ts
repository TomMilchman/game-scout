import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { jsonError } from "./utils/apiUtils";

const isPublicRoute = createRouteMatcher(["/", "/about", "/auth/(.*)"]);
const isWebhookRoute = createRouteMatcher(["/api/webhooks(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    // Skip auth for webhook routes
    if (isWebhookRoute(req)) return NextResponse.next();

    const { userId, redirectToSignIn } = await auth();

    // API route protection
    if (!userId && req.nextUrl.pathname.startsWith("/api")) {
        return jsonError("Unauthorized", 401);
    }

    // Page route protection
    if (!userId && !isPublicRoute(req)) {
        return redirectToSignIn();
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
