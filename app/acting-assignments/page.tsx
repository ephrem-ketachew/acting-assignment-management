"use client";

import { useCallback, Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";
import { useActingAssignmentsList } from "@/hooks/use-acting-assignments";
import { formatDate, daysUntilEnd } from "@/lib/dayjs-format";
import { getExpirationReminderDays } from "@/lib/expiration-reminder-config";
import { StatusBadge } from "@/components/acting/status-badge";
import type { ActingAssignment, ActingAssignmentStatus } from "@/models/acting-assignment";

const STATUS_OPTIONS: { value: string; label: string }[] = [
    { value: "all", label: "All" },
    { value: "Scheduled", label: "Scheduled" },
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

    const reminderDays = getExpirationReminderDays();

    function isExpiringSoon(a: ActingAssignment): boolean {
        if (a.status !== "Active") return false;
        const days = daysUntilEnd(a.expectedEndDate);
        return days >= 0 && days <= reminderDays;
    }

    const expiringSoonCount =
        assignments !== undefined
            ? assignments.filter(isExpiringSoon).length
            : 0;
    const hasShownExpiringToast = useRef<boolean>(false);

    useEffect(() => {
        if (
            !isLoading &&
            assignments !== undefined &&
            expiringSoonCount > 0 &&
            !hasShownExpiringToast.current
        ) {
            hasShownExpiringToast.current = true;
            toast.info(
                `${expiringSoonCount} assignment(s) expire within ${reminderDays} days`
            );
        }
    }, [isLoading, assignments, expiringSoonCount, reminderDays]);

    function ExpiringSoonBadge({ expectedEndDate }: { expectedEndDate: string }): React.ReactElement {
        const days = daysUntilEnd(expectedEndDate);
        const label = days === 0 ? "Expires today" : `Expires in ${days} day${days === 1 ? "" : "s"}`;
        return (
            <Badge variant="secondary" className="ml-1 whitespace-nowrap">
                {label}
            </Badge>
        );
    }

    return (
        <main id="main-content" className="min-h-screen bg-background text-foreground p-4 md:p-6">
            <div className="mx-auto max-w-6xl space-y-6">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-semibold">
                        Acting Assignments
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select
                            value={displayStatus}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-[200px]" aria-label="Filter by status">
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
                </header>

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
                        <section aria-label="Assignments list" className="rounded-md border">
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
                                                <div className="flex flex-wrap items-center gap-1">
                                                    <StatusBadge
                                                        status={
                                                            a.status as ActingAssignmentStatus
                                                        }
                                                    />
                                                    {isExpiringSoon(a) && (
                                                        <ExpiringSoonBadge
                                                            expectedEndDate={
                                                                a.expectedEndDate
                                                            }
                                                        />
                                                    )}
                                                </div>
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
                        </section>
                    )
                )}
            </div>
        </main>
    );
}

export default function ActingAssignmentsPage(): React.ReactElement {
    return (
        <Suspense fallback={<main id="main-content" className="min-h-screen bg-background p-4 md:p-6" aria-busy="true"><p className="text-muted-foreground">Loading…</p></main>}>
            <ActingAssignmentsListContent />
        </Suspense>
    );
}
