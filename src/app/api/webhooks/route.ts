import { createUser, deleteUser } from "@/db/users";
import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/utils/apiUtils";
import { verifyWebhook, WebhookEvent } from "@clerk/nextjs/webhooks";

export async function POST(req: NextRequest) {
    let evt: WebhookEvent;

    try {
        evt = await verifyWebhook(req);
    } catch (verifyError) {
        console.error("Webhook verification failed:", verifyError);
        return jsonError("Invalid webhook signature", 400);
    }

    const eventType = evt.type;
    console.log(`Webhook event received: ${eventType}`);

    try {
        if (eventType === "user.created") {
            const { id, email_addresses, username } = evt.data;

            if (!id || !email_addresses?.[0]?.email_address || !username) {
                console.error("Invalid user.created payload:", evt.data);
                return jsonError("Missing user details", 400);
            }

            const userDetails = {
                id,
                email: email_addresses[0].email_address,
                username,
            };

            await createUser(userDetails);
        } else if (eventType === "user.deleted") {
            const { id } = evt.data;

            if (!id) {
                console.error("Invalid user.deleted payload:", evt.data);
                return jsonError("Missing user ID", 400);
            }

            await deleteUser(id);
        } else {
            console.warn(`Unhandled webhook event type: ${eventType}`);
        }
    } catch (dbError) {
        console.error("Database operation failed:", dbError);
        return jsonError("Internal server error", 500);
    }

    return new NextResponse(null, { status: 200 });
}
