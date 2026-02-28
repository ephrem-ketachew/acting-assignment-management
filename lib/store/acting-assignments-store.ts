import type { ActingAssignment } from "@/models/acting-assignment";

/**
 * In-memory store for acting assignments. Used only by API routes.
 * Persists across requests (module scope).
 */
export const actingAssignmentsStore: ActingAssignment[] = [];
