import { Navigation } from "@/components/navigation";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navigation />
            <div className="pt-16">
                <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </div>
        </>
    );
}
//
