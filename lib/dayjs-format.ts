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
