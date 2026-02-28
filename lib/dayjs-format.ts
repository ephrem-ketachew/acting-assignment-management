import dayjs from "dayjs";

const DATE_FORMAT = "MMMM DD, YYYY";
const TIMESTAMP_FORMAT = "MMMM DD, YYYY hh:mm A";

/**
 * Format a date string or Date as MMMM DD, YYYY.
 */
export function formatDate(value: string | Date): string {
    return dayjs(value).format(DATE_FORMAT);
}

/**
 * Format a date string or Date as MMMM DD, YYYY hh:mm A.
 */
export function formatTimestamp(value: string | Date): string {
    return dayjs(value).format(TIMESTAMP_FORMAT);
}

/**
 * Days from reference date (default today) until end date. Uses date-only comparison.
 * Positive = end is in the future, 0 = end is today, negative = end is in the past.
 */
export function daysUntilEnd(
    expectedEndDate: string,
    referenceDate?: string | Date
): number {
    const end = dayjs(expectedEndDate).startOf("day");
    const ref = referenceDate !== undefined ? dayjs(referenceDate).startOf("day") : dayjs().startOf("day");
    return end.diff(ref, "day");
}
