import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center">
            <h2>Error 404: Not Found</h2>
            <p>Could not find requested resource</p>
            <Link href="/">
                <button className="px-2 py-1 text-sm border border-neutral-300 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700 cursor-pointer">
                    Return Home
                </button>
            </Link>
        </div>
    );
}
