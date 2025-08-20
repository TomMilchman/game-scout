import Navigation from "@/components/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navigation />
            <div className="pt-16">{children}</div>
        </>
    );
}
