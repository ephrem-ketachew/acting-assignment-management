import Link from "next/link";

export default function Home(): React.ReactElement {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
            <main className="flex flex-col items-center gap-6 text-center">
                <h1 className="text-2xl font-semibold">
                    Acting Assignment Management
                </h1>
                <p className="text-muted-foreground">
                    Manage temporary acting assignments and compensation.
                </p>
                <Link
                    href="/acting-assignments"
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                    View acting assignments
                </Link>
            </main>
        </div>
    );
}
