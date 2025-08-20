import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 px-4">
            <h1 className="text-6xl font-bold text-blue-500 mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
            <p className="text-gray-400 mb-8 text-center">
                Sorry, the page you’re looking for doesn’t exist or has been
                moved.
            </p>
            <Link
                href="/"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
            >
                Return Home
            </Link>
        </div>
    );
}
