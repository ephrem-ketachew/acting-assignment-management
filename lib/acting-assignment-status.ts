import dayjs from "dayjs";
import type { ActingAssignmentStatus } from "@/models/acting-assignment";

/**
 * Compute effective status from dates. Manual statuses (Terminated Early, Converted to Permanent) are preserved.
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
        return "Active";
    }
    if (today.isAfter(end)) {
        return "Expired";
    }
    return "Active";
}
