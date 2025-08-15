import sql from "@/lib/db";

type UserDetails = {
    id: string;
    username: string;
    email: string;
};

export async function createUser(userDetails: UserDetails) {
    await sql`
        INSERT INTO users (id, email, username)
        VALUES (${userDetails.id}, ${userDetails.email}, ${userDetails.username})
        ON CONFLICT (id) DO NOTHING
    `;
}

export async function deleteUser(id: string) {
    await sql`
        DELETE FROM users WHERE id=${id}`;
}
