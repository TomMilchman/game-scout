import { Navigation } from "@/components/navigation";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navigation />
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </>
    );
}
