import dayjs from "dayjs";
import type { ActingAssignmentStatus } from "@/models/acting-assignment";

/**
 * Single source of truth for assignment status from dates.
 * Uses date-only comparison (startOf day) for consistency and same-day edge cases.
 * Manual statuses (Terminated Early, Converted to Permanent) are always preserved.
 * - Scheduled: today is before start date
 * - Active: today is on or after start and on or before end date
 * - Expired: today is after end date
 */
export function computeStatus(
    startDate: string,
    expectedEndDate: string,
    currentStatus: ActingAssignmentStatus
): ActingAssignmentStatus {
    if (
        currentStatus === "Terminated Early" ||
        currentStatus === "Converted to Permanent"
    ) {
        return currentStatus;
    }
    const today = dayjs().startOf("day");
    const start = dayjs(startDate).startOf("day");
    const end = dayjs(expectedEndDate).startOf("day");
    if (today.isBefore(start)) {
        return "Scheduled";
    }
    if (today.isAfter(end)) {
        return "Expired";
    }
    return "Active";
}
