import type {
    ActingAssignment,
    CreateActingAssignmentDTO,
} from "@/models/acting-assignment";

const BASE = "";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const message =
            typeof data?.error === "string" ? data.error : "Request failed";
        throw new Error(message);
    }
    return data as T;
}

/**
 * Fetch all acting assignments, optionally filtered by status.
 */
export async function getList(
    status?: string | null
): Promise<ActingAssignment[]> {
    try {
        const url =
            status && status.trim() !== ""
                ? `${BASE}/api/acting-assignments?status=${encodeURIComponent(status.trim())}`
                : `${BASE}/api/acting-assignments`;
        return await fetchJson<ActingAssignment[]>(url);
    } catch (error) {
        throw error instanceof Error ? error : new Error("Failed to fetch list");
    }
}

/**
 * Fetch a single acting assignment by id.
 */
export async function getById(id: string): Promise<ActingAssignment> {
    try {
        return await fetchJson<ActingAssignment>(
            `${BASE}/api/acting-assignments/${encodeURIComponent(id)}`
        );
    } catch (error) {
        throw error instanceof Error ? error : new Error("Failed to fetch assignment");
    }
}

/**
 * Create a new acting assignment.
 */
export async function create(
    dto: CreateActingAssignmentDTO
): Promise<ActingAssignment> {
    try {
        return await fetchJson<ActingAssignment>(
            `${BASE}/api/acting-assignments`,
            {
                method: "POST",
                body: JSON.stringify(dto),
            }
        );
    } catch (error) {
        throw error instanceof Error ? error : new Error("Failed to create assignment");
    }
}

/**
 * Update assignment status to Terminated Early or Converted to Permanent.
 */
export async function updateStatus(
    id: string,
    status: "Terminated Early" | "Converted to Permanent"
): Promise<ActingAssignment> {
    try {
        return await fetchJson<ActingAssignment>(
            `${BASE}/api/acting-assignments/${encodeURIComponent(id)}`,
            {
                method: "PATCH",
                body: JSON.stringify({ status }),
            }
        );
    } catch (error) {
        throw error instanceof Error ? error : new Error("Failed to update status");
    }
}
