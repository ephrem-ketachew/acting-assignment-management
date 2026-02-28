"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useActingAssignment, useUpdateActingAssignmentStatus } from "@/hooks/use-acting-assignments";
import { formatDate, formatTimestamp } from "@/lib/dayjs-format";
import { StatusBadge } from "@/components/acting/status-badge";
import { CompensationDisplay } from "@/components/acting/compensation-display";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { ActingAssignmentStatus } from "@/models/acting-assignment";

const COMPENSATION_TYPE_LABELS: Record<string, string> = {
    fixed: "Fixed Salary Increment",
    percentage: "Percentage Increase",
    allowance: "Acting Allowance",
    multiple: "Multiple Allowances",
};

function DetailContent({ id }: { id: string }): React.ReactElement {
    const { data: assignment, isLoading, isError, error } = useActingAssignment(id);
    const updateStatusMutation = useUpdateActingAssignmentStatus();

    const canUpdateStatus =
        assignment !== undefined &&
        assignment.status !== "Terminated Early" &&
        assignment.status !== "Converted to Permanent";

    const handleTerminateEarly = (): void => {
        if (assignment?.id === null || assignment?.id === undefined) return;
        updateStatusMutation.mutate({
            id: assignment.id,
            status: "Terminated Early",
        });
    };

    const handleConvertToPermanent = (): void => {
        if (assignment?.id === null || assignment?.id === undefined) return;
        updateStatusMutation.mutate({
            id: assignment.id,
            status: "Converted to Permanent",
        });
    };

    if (isLoading) {
        return (
            <main id="main-content" className="min-h-screen bg-background p-4 md:p-6" aria-busy="true">
                <p className="text-muted-foreground">Loading…</p>
            </main>
        );
    }

    if (isError || assignment === undefined) {
        return (
            <main id="main-content" className="min-h-screen bg-background p-4 md:p-6">
                <p className="text-destructive" role="alert">
                    {error instanceof Error ? error.message : "Assignment not found"}
                </p>
                <Button variant="link" asChild className="mt-2">
                    <Link href="/acting-assignments">Back to list</Link>
                </Button>
            </main>
        );
    }

    const status = assignment.status as ActingAssignmentStatus;

    return (
        <main id="main-content" className="min-h-screen bg-background text-foreground p-4 md:p-6">
            <div className="mx-auto max-w-3xl space-y-6">
                <header className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/acting-assignments">Back to list</Link>
                    </Button>
                </header>

                <section aria-labelledby="assignment-heading">
                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <CardTitle id="assignment-heading">
                                <h1 className="text-lg font-semibold leading-none tracking-tight">Acting assignment</h1>
                            </CardTitle>
                            <StatusBadge status={status} />
                        </div>
                        <CardDescription>
                            {assignment.employeeName}
                            {assignment.employeeId !== null &&
                            assignment.employeeId.trim() !== ""
                                ? ` (ID: ${assignment.employeeId})`
                                : ""}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Current position
                                </p>
                                <p className="font-medium">
                                    {assignment.currentPosition}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Acting position
                                </p>
                                <p className="font-medium">
                                    {assignment.actingPosition}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Acting department
                                </p>
                                <p className="font-medium">
                                    {assignment.actingDepartment}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Start date
                                </p>
                                <p>{formatDate(assignment.startDate)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Expected end date
                                </p>
                                <p>{formatDate(assignment.expectedEndDate)}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-muted-foreground text-sm">
                                Reason for acting
                            </p>
                            <p>{assignment.reason}</p>
                        </div>

                        <div>
                            <p className="text-muted-foreground text-sm">
                                Compensation type
                            </p>
                            <p className="font-medium">
                                {COMPENSATION_TYPE_LABELS[assignment.compensationType] ??
                                    assignment.compensationType}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-sm">
                                Compensation details
                            </p>
                            <CompensationDisplay
                                payload={assignment.compensationPayload}
                            />
                        </div>

                        <div>
                            <p className="text-muted-foreground text-sm">
                                Created at
                            </p>
                            <p>{formatTimestamp(assignment.createdAt)}</p>
                        </div>

                        {canUpdateStatus && (
                            <div className="flex flex-wrap gap-3 border-t pt-4">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleTerminateEarly}
                                    disabled={updateStatusMutation.isPending}
                                >
                                    Terminate early
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleConvertToPermanent}
                                    disabled={updateStatusMutation.isPending}
                                >
                                    Mark as converted to permanent
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
                </section>
            </div>
        </main>
    );
}

export default function ActingAssignmentDetailPage(): React.ReactElement {
    const params = useParams();
    const id = typeof params.id === "string" ? params.id : "";

    if (id === "") {
        return (
            <main id="main-content" className="min-h-screen bg-background p-4 md:p-6">
                <p className="text-destructive" role="alert">Invalid assignment ID</p>
                <Button variant="link" asChild className="mt-2">
                    <Link href="/acting-assignments">Back to list</Link>
                </Button>
            </main>
        );
    }

    return <DetailContent id={id} />;
}
