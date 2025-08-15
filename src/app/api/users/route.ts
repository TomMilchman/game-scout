import { NextRequest, NextResponse } from "next/server";
import { addUser } from "@/db/users";
import { jsonError } from "@/app/utils/apiUtils";

export async function POST(req: NextRequest) {
    try {
        const payload = (await req.json()).data;
        const id: string = payload.id;
        const email: string = payload.email_addresses[0]?.email_address;
        const username: string = payload.username;
        addUser({ id, email, username });

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error("Webhook error:", error);
        return jsonError(`Webhook error: ${error}`, 500);
    }
}
