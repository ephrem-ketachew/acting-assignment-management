/**
 * Default number of days before end date to show expiration reminder.
 */
export const DEFAULT_EXPIRATION_REMINDER_DAYS = 7;

/**
 * Number of days before end date to remind HR. Uses env NEXT_PUBLIC_EXPIRATION_REMINDER_DAYS if set.
 */
export function getExpirationReminderDays(): number {
    if (typeof process.env.NEXT_PUBLIC_EXPIRATION_REMINDER_DAYS === "string") {
        const parsed = parseInt(
            process.env.NEXT_PUBLIC_EXPIRATION_REMINDER_DAYS,
            10
        );
        if (!Number.isNaN(parsed) && parsed >= 0) {
            return parsed;
        }
    }
    return DEFAULT_EXPIRATION_REMINDER_DAYS;
}
