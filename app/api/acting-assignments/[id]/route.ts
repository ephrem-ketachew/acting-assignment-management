import { NextRequest, NextResponse } from "next/server";
import { actingAssignmentsStore } from "@/lib/store/acting-assignments-store";
import { computeStatus } from "@/lib/acting-assignment-status";
import { isAllowedUpdateStatus } from "@/lib/validate-acting-assignment";
import type { ActingAssignment, ActingAssignmentStatus } from "@/models/acting-assignment";

function withComputedStatus(a: ActingAssignment): ActingAssignment {
    const status = computeStatus(
        a.startDate,
        a.expectedEndDate,
        a.status
    ) as ActingAssignmentStatus;
    return { ...a, status };
}

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    const { id } = await context.params;
    const assignment = actingAssignmentsStore.find((a) => a.id === id);
    if (!assignment) {
        return NextResponse.json(
            { error: "Acting assignment not found" },
            { status: 404 }
        );
    }
    return NextResponse.json(withComputedStatus(assignment));
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    const { id } = await context.params;
    const assignment = actingAssignmentsStore.find((a) => a.id === id);
    if (!assignment) {
        return NextResponse.json(
            { error: "Acting assignment not found" },
            { status: 404 }
        );
    }
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 }
        );
    }
    if (body === null || typeof body !== "object" || !("status" in body)) {
        return NextResponse.json(
            { error: "Body must contain status" },
            { status: 400 }
        );
    }
    const newStatus = (body as { status: string }).status;
    if (typeof newStatus !== "string" || !isAllowedUpdateStatus(newStatus)) {
        return NextResponse.json(
            {
                error:
                    "status must be one of: Terminated Early, Converted to Permanent",
            },
            { status: 400 }
        );
    }
    assignment.status = newStatus as ActingAssignmentStatus;
    return NextResponse.json(withComputedStatus(assignment));
}
