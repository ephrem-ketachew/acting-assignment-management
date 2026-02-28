"use client";

import { Badge } from "@/components/ui/badge";
import type { ActingAssignmentStatus } from "@/models/acting-assignment";

const STATUS_VARIANTS: Record<
    ActingAssignmentStatus,
    "default" | "secondary" | "destructive" | "outline"
> = {
    Scheduled: "outline",
    Active: "default",
    Expired: "destructive",
    "Terminated Early": "secondary",
    "Converted to Permanent": "outline",
};

interface StatusBadgeProps {
    status: ActingAssignmentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps): React.ReactElement {
    const variant = STATUS_VARIANTS[status] ?? "outline";
    return <Badge variant={variant}>{status}</Badge>;
}
