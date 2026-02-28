/**
 * Status values for acting assignment lifecycle.
 */
export type ActingAssignmentStatus =
    | "Active"
    | "Expired"
    | "Terminated Early"
    | "Converted to Permanent";

/**
 * Compensation adjustment types.
 */
export type CompensationType = "fixed" | "percentage" | "allowance" | "multiple";

/**
 * Compensation payload for fixed salary increment.
 */
export interface CompensationFixed {
    type: "fixed";
    amount: number;
}

/**
 * Compensation payload for percentage increase.
 */
export interface CompensationPercentage {
    type: "percentage";
    percent: number;
}

/**
 * Compensation payload for single acting allowance.
 */
export interface CompensationAllowance {
    type: "allowance";
    amount: number;
}

/**
 * Single allowance item for multiple allowances.
 */
export interface AllowanceItem {
    name: string;
    amount: number;
}

/**
 * Compensation payload for multiple allowances.
 */
export interface CompensationMultiple {
    type: "multiple";
    allowances: AllowanceItem[];
}

/**
 * Discriminated union of all compensation payloads.
 */
export type CompensationPayload =
    | CompensationFixed
    | CompensationPercentage
    | CompensationAllowance
    | CompensationMultiple;

/**
 * Acting assignment as stored and returned by the API.
 */
export interface ActingAssignment {
    id: string | null;
    employeeId: string | null;
    employeeName: string;
    currentPosition: string;
    actingPosition: string;
    actingDepartment: string;
    startDate: string;
    expectedEndDate: string;
    reason: string;
    compensationType: CompensationType;
    compensationPayload: CompensationPayload;
    status: ActingAssignmentStatus;
    createdAt: string;
}

/**
 * DTO for creating a new acting assignment (no id, status, createdAt).
 */
export interface CreateActingAssignmentDTO {
    employeeId: string | null;
    employeeName: string;
    currentPosition: string;
    actingPosition: string;
    actingDepartment: string;
    startDate: string;
    expectedEndDate: string;
    reason: string;
    compensationType: CompensationType;
    compensationPayload: CompensationPayload;
}
