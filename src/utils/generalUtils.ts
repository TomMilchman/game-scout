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
