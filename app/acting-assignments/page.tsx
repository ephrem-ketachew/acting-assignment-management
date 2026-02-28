"use client";

import { useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useActingAssignmentsList } from "@/hooks/use-acting-assignments";
import { formatDate } from "@/lib/dayjs-format";
import { StatusBadge } from "@/components/acting/status-badge";
import type { ActingAssignmentStatus } from "@/models/acting-assignment";

const STATUS_OPTIONS: { value: string; label: string }[] = [
    { value: "all", label: "All" },
    { value: "Active", label: "Active" },
    { value: "Expired", label: "Expired" },
    { value: "Terminated Early", label: "Terminated Early" },
    { value: "Converted to Permanent", label: "Converted to Permanent" },
];

function ActingAssignmentsListContent(): React.ReactElement {
    const router = useRouter();
    const searchParams = useSearchParams();
    const statusParam = searchParams.get("status");
    const statusFilter =
        statusParam === "" || statusParam === null || statusParam === "all"
            ? null
            : statusParam;

    const { data: assignments, isLoading, isError, error } = useActingAssignmentsList(statusFilter);

    const setStatusFilter = useCallback(
        (value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === "all" || value === "") {
                params.delete("status");
            } else {
                params.set("status", value);
            }
            const query = params.toString();
            router.push(`/acting-assignments${query ? `?${query}` : ""}`);
        },
        [router, searchParams]
    );

    const displayStatus = statusFilter === null ? "all" : statusFilter;

    return (
        <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-semibold">
                        Acting Assignments
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select
                            value={displayStatus}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((opt) => (
                                    <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button asChild>
                            <Link href="/acting-assignments/new">
                                New assignment
                            </Link>
                        </Button>
                    </div>
                </div>

                {isLoading && (
                    <p className="text-muted-foreground">Loading…</p>
                )}
                {isError && (
                    <p className="text-destructive">
                        {error instanceof Error ? error.message : "Failed to load assignments"}
                    </p>
                )}
                {!isLoading && !isError && assignments !== undefined && (
                    assignments.length === 0 ? (
                        <p className="text-muted-foreground">
                            No assignments found.
                        </p>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Current position</TableHead>
                                        <TableHead>Acting position</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Start date</TableHead>
                                        <TableHead>End date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[80px]" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(assignments ?? []).map((a) => (
                                        <TableRow key={a.id ?? ""}>
                                            <TableCell className="font-medium">
                                                {a.employeeName}
                                            </TableCell>
                                            <TableCell>
                                                {a.currentPosition}
                                            </TableCell>
                                            <TableCell>
                                                {a.actingPosition}
                                            </TableCell>
                                            <TableCell>
                                                {a.actingDepartment}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(a.startDate)}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(a.expectedEndDate)}
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge
                                                    status={
                                                        a.status as ActingAssignmentStatus
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/acting-assignments/${a.id ?? ""}`}
                                                    >
                                                        View
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default function ActingAssignmentsPage(): React.ReactElement {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background p-4 md:p-6"><p className="text-muted-foreground">Loading…</p></div>}>
            <ActingAssignmentsListContent />
        </Suspense>
    );
}
