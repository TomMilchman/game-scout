import { createUser } from "@/db/users";
import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/app/utils/apiUtils";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req);
        const eventType = evt.type;

        if (eventType === "user.created") {
            const { id, email_addresses, username } = evt.data;

            if (!id || !email_addresses || !username) {
                return jsonError("Error: Missing user details", 400);
            }

            const userDetails = {
                id,
                email: email_addresses[0]?.email_address,
                username,
            };

            await createUser(userDetails);
        }

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error("Error verifying webhook:", error);
        return jsonError(
            `Error occurred while verifying webhook: ${error}`,
            400
        );
    }
}
