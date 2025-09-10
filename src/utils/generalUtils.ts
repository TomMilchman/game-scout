import { ActionResult } from "@/app/types";

export async function executeAction<T>(
    fn: () => Promise<T>
): Promise<ActionResult<T>> {
    try {
        const data = await fn();
        return { success: true, data };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);

        if (process.env.NODE_ENV === "development")
            console.error(
                `Error: ${message}\nCall stack: ${(error as Error).stack}`
            );
        else console.error(`Error:`, message);

        return { success: false, error: message };
    }
}

export function normalizeQuery(query: string) {
    return query
        .trim() // remove leading/trailing spaces
        .toLowerCase() // lowercase everything
        .replace(/[-_]/g, " ") // replace hyphens/underscores with space
        .replace(/[^\w\s]/g, "") // remove other punctuation
        .replace(/\s+/g, " "); // collapse multiple spaces
}

export function generateGameSlug(title: string, spaceReplacer: string) {
    return title
        .toLowerCase()
        .replace(/'/g, "") // remove apostrophes
        .replace(/[^a-z0-9 ]/g, "") // remove other non-alphanumeric characters except space
        .trim()
        .replace(/\s+/g, spaceReplacer); // replace spaces with underscores
}
