/**
 * In-memory store for acting assignments. Used only by API routes.
 * Persists across requests (module scope). Refined in Phase 1 with full model.
 */
export interface ActingAssignmentRecord {
    id: string | null;
    employeeId: string | null;
    employeeName: string;
    currentPosition: string;
    actingPosition: string;
    actingDepartment: string;
    startDate: string;
    expectedEndDate: string;
    reason: string;
    compensationType: string;
    compensationPayload: unknown;
    status: string;
    createdAt: string;
}

export const actingAssignmentsStore: ActingAssignmentRecord[] = [];
