import type {
    CompensationPayload,
    CompensationType,
    CreateActingAssignmentDTO,
} from "@/models/acting-assignment";

const COMPENSATION_TYPES = ["fixed", "percentage", "allowance", "multiple"] as const;

function isCompensationType(s: string): s is CompensationType {
    return (COMPENSATION_TYPES as readonly string[]).includes(s);
}

function validateCompensationPayload(
    type: string,
    payload: unknown
): payload is CompensationPayload {
    if (payload === null || typeof payload !== "object") {
        return false;
    }
    const p = payload as Record<string, unknown>;
    switch (type) {
        case "fixed":
            return typeof p.amount === "number";
        case "percentage":
            return typeof p.percent === "number";
        case "allowance":
            return typeof p.amount === "number";
        case "multiple":
            return (
                Array.isArray(p.allowances) &&
                p.allowances.every(
                    (a: unknown) =>
                        typeof a === "object" &&
                        a !== null &&
                        "name" in a &&
                        "amount" in a &&
                        typeof (a as { name: unknown }).name === "string" &&
                        typeof (a as { amount: unknown }).amount === "number"
                )
            );
        default:
            return false;
    }
}

/**
 * Parse and validate body as CreateActingAssignmentDTO. Returns error message or the DTO.
 */
export function parseCreateBody(body: unknown): CreateActingAssignmentDTO | string {
    if (body === null || typeof body !== "object") {
        return "Body must be an object";
    }
    const b = body as Record<string, unknown>;
    const employeeId =
        b.employeeId === undefined || b.employeeId === null
            ? null
            : typeof b.employeeId === "string"
              ? b.employeeId
              : null;
    const employeeName = typeof b.employeeName === "string" ? b.employeeName : "";
    const currentPosition =
        typeof b.currentPosition === "string" ? b.currentPosition : "";
    const actingPosition =
        typeof b.actingPosition === "string" ? b.actingPosition : "";
    const actingDepartment =
        typeof b.actingDepartment === "string" ? b.actingDepartment : "";
    const startDate = typeof b.startDate === "string" ? b.startDate : "";
    const expectedEndDate =
        typeof b.expectedEndDate === "string" ? b.expectedEndDate : "";
    const reason = typeof b.reason === "string" ? b.reason : "";
    const compensationTypeRaw =
        typeof b.compensationType === "string" ? b.compensationType : "";
    const compensationPayload = b.compensationPayload;

    if (!employeeName.trim()) {
        return "employeeName is required";
    }
    if (!currentPosition.trim()) {
        return "currentPosition is required";
    }
    if (!actingPosition.trim()) {
        return "actingPosition is required";
    }
    if (!actingDepartment.trim()) {
        return "actingDepartment is required";
    }
    if (!startDate) {
        return "startDate is required";
    }
    if (!expectedEndDate) {
        return "expectedEndDate is required";
    }
    if (!reason.trim()) {
        return "reason is required";
    }
    if (!isCompensationType(compensationTypeRaw)) {
        return "compensationType must be one of: fixed, percentage, allowance, multiple";
    }
    if (!validateCompensationPayload(compensationTypeRaw, compensationPayload)) {
        return "compensationPayload is invalid for the given compensationType";
    }

    const start = new Date(startDate);
    const end = new Date(expectedEndDate);
    if (Number.isNaN(start.getTime())) {
        return "startDate must be a valid date";
    }
    if (Number.isNaN(end.getTime())) {
        return "expectedEndDate must be a valid date";
    }
    if (start.getTime() > end.getTime()) {
        return "startDate must be before expectedEndDate";
    }

    const payload = compensationPayload as CompensationPayload;
    return {
        employeeId,
        employeeName: employeeName.trim(),
        currentPosition: currentPosition.trim(),
        actingPosition: actingPosition.trim(),
        actingDepartment: actingDepartment.trim(),
        startDate,
        expectedEndDate,
        reason: reason.trim(),
        compensationType: compensationTypeRaw,
        compensationPayload: payload,
    };
}

/** Statuses allowed in PATCH body (terminate early or convert to permanent). */
export function isAllowedUpdateStatus(s: string): boolean {
    return s === "Terminated Early" || s === "Converted to Permanent";
}
