"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
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
        if (typeof console !== "undefined" && console.error) {
            console.error("ErrorBoundary caught an error", error, errorInfo);
        }
    }

    public render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black text-white p-4">
                    <h2 className="text-xl font-semibold">Something went wrong</h2>
                    <button
                        type="button"
                        onClick={() => this.setState({ hasError: false })}
                        className="rounded border border-white px-4 py-2 hover:bg-white hover:text-black"
                    >
                        Try again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
