import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import { actingAssignmentsStore } from "@/lib/store/acting-assignments-store";
import { computeStatus } from "@/lib/acting-assignment-status";
import { parseCreateBody } from "@/lib/validate-acting-assignment";
import type { ActingAssignment, ActingAssignmentStatus } from "@/models/acting-assignment";

function withComputedStatus(a: ActingAssignment): ActingAssignment {
    const status = computeStatus(
        a.startDate,
        a.expectedEndDate,
        a.status
    ) as ActingAssignmentStatus;
    return { ...a, status };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const statusFilter = request.nextUrl.searchParams.get("status");
    let list = actingAssignmentsStore.map(withComputedStatus);
    if (statusFilter && statusFilter.trim() !== "") {
        list = list.filter((a) => a.status === statusFilter.trim());
    }
    return NextResponse.json(list);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 }
        );
    }
    const parsed = parseCreateBody(body);
    if (typeof parsed === "string") {
        return NextResponse.json({ error: parsed }, { status: 400 });
    }
    const id = crypto.randomUUID();
    const status: ActingAssignmentStatus = "Active";
    const createdAt = dayjs().toISOString();
    const assignment: ActingAssignment = {
        id,
        employeeId: parsed.employeeId,
        employeeName: parsed.employeeName,
        currentPosition: parsed.currentPosition,
        actingPosition: parsed.actingPosition,
        actingDepartment: parsed.actingDepartment,
        startDate: parsed.startDate,
        expectedEndDate: parsed.expectedEndDate,
        reason: parsed.reason,
        compensationType: parsed.compensationType,
        compensationPayload: parsed.compensationPayload,
        status,
        createdAt,
    };
    actingAssignmentsStore.push(assignment);
    return NextResponse.json(withComputedStatus(assignment), { status: 201 });
}
