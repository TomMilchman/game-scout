export function normalizeQuery(query: string) {
    return query
        .trim() // remove leading/trailing spaces
        .toLowerCase() // lowercase everything
        .replace(/[-_]/g, " ") // replace hyphens/underscores with space
        .replace(/[^\w\s]/g, "") // remove other punctuation
        .replace(/\s+/g, " "); // collapse multiple spaces
}
