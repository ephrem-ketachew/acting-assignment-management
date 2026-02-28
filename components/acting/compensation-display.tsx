"use client";

import type { CompensationPayload } from "@/models/acting-assignment";

interface CompensationDisplayProps {
    payload: CompensationPayload;
}

export function CompensationDisplay({
    payload,
}: CompensationDisplayProps): React.ReactElement {
    switch (payload.type) {
        case "fixed":
            return (
                <span>
                    Fixed increment: {payload.amount}
                </span>
            );
        case "percentage":
            return (
                <span>
                    Percentage: {payload.percent}%
                </span>
            );
        case "allowance":
            return (
                <span>
                    Allowance: {payload.amount}
                </span>
            );
        case "multiple":
            return (
                <div className="space-y-1">
                    <span className="font-medium">Allowances:</span>
                    <ul className="list-inside list-disc text-sm">
                        {payload.allowances.map((a, i) => (
                            <li key={i}>
                                {a.name}: {a.amount}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        default:
            return <span>—</span>;
    }
}
