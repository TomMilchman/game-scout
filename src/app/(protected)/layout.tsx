import { Navigation } from "@/components/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navigation />
            {children}
        </>
    );
}
