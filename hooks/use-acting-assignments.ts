"use client";

import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import * as actingAssignmentService from "@/services/acting-assignment-service";
import type { CreateActingAssignmentDTO } from "@/models/acting-assignment";

/** Query key prefix for acting assignments. Invalidate this to refetch list and detail. */
export const actingAssignmentsQueryKey = ["acting-assignments"] as const;

function listQueryKey(status: string | null | undefined): readonly [string, string, string] {
    const filter = status === undefined || status === null || status.trim() === ""
        ? "all"
        : status.trim();
    return [...actingAssignmentsQueryKey, "list", filter];
}

function detailQueryKey(id: string): readonly [string, string, string] {
    return [...actingAssignmentsQueryKey, "detail", id];
}

/**
 * Fetch acting assignments list, optionally filtered by status.
 */
export function useActingAssignmentsList(status: string | null | undefined) {
    return useQuery({
        queryKey: listQueryKey(status),
        queryFn: () => actingAssignmentService.getList(status),
    });
}

/**
 * Fetch a single acting assignment by id.
 */
export function useActingAssignment(id: string | null | undefined) {
    return useQuery({
        queryKey: detailQueryKey(id ?? ""),
        queryFn: () => actingAssignmentService.getById(id as string),
        enabled: typeof id === "string" && id.trim() !== "",
    });
}

/**
 * Create a new acting assignment. Invalidates list on success; shows toast on error.
 */
export function useCreateActingAssignment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: CreateActingAssignmentDTO) =>
            actingAssignmentService.create(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: actingAssignmentsQueryKey });
        },
        onError: (error: Error) => {
            toast.error(error.message ?? "Failed to create assignment");
        },
    });
}

/**
 * Update assignment status (Terminated Early or Converted to Permanent).
 * Invalidates list and detail on success; shows toast on error.
 */
export function useUpdateActingAssignmentStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            status,
        }: {
            id: string;
            status: "Terminated Early" | "Converted to Permanent";
        }) => actingAssignmentService.updateStatus(id, status),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: actingAssignmentsQueryKey });
            toast.success(
                variables.status === "Terminated Early"
                    ? "Assignment terminated early"
                    : "Assignment marked as converted to permanent"
            );
        },
        onError: (error: Error) => {
            toast.error(error.message ?? "Failed to update status");
        },
    });
}
