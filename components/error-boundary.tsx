"use client";

import Link from "next/link";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

/**
 * Log error for debugging without exposing secrets (no passwords, tokens, or PII).
 * Logs only error name, message, and component stack.
 */
function logErrorSafe(error: Error, errorInfo: ErrorInfo): void {
    if (typeof console === "undefined" || !console.error) return;
    console.error("[ErrorBoundary]", error.name, error.message);
    if (errorInfo.componentStack) {
        console.error("[ErrorBoundary] component stack:", errorInfo.componentStack);
    }
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    public static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        logErrorSafe(error, errorInfo);
    }

    public render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div
                    className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground p-4"
                    role="alert"
                >
                    <h2 className="text-xl font-semibold">Something went wrong</h2>
                    <p className="text-muted-foreground text-center text-sm">
                        An unexpected error occurred. You can try again or go back to the list.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => this.setState({ hasError: false })}
                            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            Try again
                        </button>
                        <Link
                            href="/acting-assignments"
                            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            Back to list
                        </Link>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
