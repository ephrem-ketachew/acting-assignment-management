"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCreateActingAssignment } from "@/hooks/use-acting-assignments";
import { CompensationInputs, type CreateFormValues } from "@/components/acting/compensation-inputs";
import type {
    CompensationPayload,
    CompensationType,
    CreateActingAssignmentDTO,
} from "@/models/acting-assignment";

const COMPENSATION_OPTIONS: { value: CompensationType; label: string }[] = [
    { value: "fixed", label: "Fixed Salary Increment" },
    { value: "percentage", label: "Percentage Increase" },
    { value: "allowance", label: "Acting Allowance" },
    { value: "multiple", label: "Multiple Allowances" },
];

function buildCompensationPayload(
    type: CompensationType,
    amount: number | undefined,
    percent: number | undefined,
    allowances: { name: string; amount: number }[]
): CompensationPayload {
    switch (type) {
        case "fixed":
            return { type: "fixed", amount: amount ?? 0 };
        case "percentage":
            return { type: "percentage", percent: percent ?? 0 };
        case "allowance":
            return { type: "allowance", amount: amount ?? 0 };
        case "multiple":
            return {
                type: "multiple",
                allowances: allowances.filter((a) => a.name.trim() !== ""),
            };
        default:
            return { type: "fixed", amount: 0 };
    }
}

export default function NewActingAssignmentPage(): React.ReactElement {
    const router = useRouter();
    const createMutation = useCreateActingAssignment();
    const [allowances, setAllowances] = useState<{ name: string; amount: number }[]>([]);

    const form = useForm<CreateFormValues>({
        defaultValues: {
            employeeId: "",
            employeeName: "",
            currentPosition: "",
            actingPosition: "",
            actingDepartment: "",
            startDate: "",
            expectedEndDate: "",
            reason: "",
            compensationType: "fixed",
            compensationAmount: undefined,
            compensationPercent: undefined,
        },
    });

    const onSubmit = useCallback(
        (values: CreateFormValues) => {
            const start = values.startDate ? new Date(values.startDate) : null;
            const end = values.expectedEndDate
                ? new Date(values.expectedEndDate)
                : null;
            if (start !== null && end !== null && start.getTime() > end.getTime()) {
                toast.error("Start date must be before expected end date");
                return;
            }
            const payload = buildCompensationPayload(
                values.compensationType,
                values.compensationAmount,
                values.compensationPercent,
                allowances
            );
            const dto: CreateActingAssignmentDTO = {
                employeeId:
                    values.employeeId.trim() === "" ? null : values.employeeId.trim(),
                employeeName: values.employeeName.trim(),
                currentPosition: values.currentPosition.trim(),
                actingPosition: values.actingPosition.trim(),
                actingDepartment: values.actingDepartment.trim(),
                startDate: values.startDate,
                expectedEndDate: values.expectedEndDate,
                reason: values.reason.trim(),
                compensationType: values.compensationType,
                compensationPayload: payload,
            };
            createMutation.mutate(dto, {
                onSuccess: (created) => {
                    toast.success("Acting assignment created");
                    router.push(
                        created.id !== null
                            ? `/acting-assignments/${created.id}`
                            : "/acting-assignments"
                    );
                },
            });
        },
        [allowances, createMutation, router]
    );

    return (
        <main id="main-content" className="min-h-screen bg-background text-foreground p-4 md:p-6">
            <div className="mx-auto max-w-2xl space-y-6">
                <header className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/acting-assignments">Back</Link>
                    </Button>
                    <h1 className="text-2xl font-semibold">New acting assignment</h1>
                </header>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="employeeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Employee ID (optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="ID"
                                            {...field}
                                            value={field.value ?? ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="employeeName"
                            rules={{ required: "Employee name is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Employee name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Full name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="currentPosition"
                            rules={{ required: "Current position is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current position</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="actingPosition"
                            rules={{ required: "Acting position is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Acting position</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="actingDepartment"
                            rules={{ required: "Acting department is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Acting department</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Department" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="startDate"
                                rules={{ required: "Start date is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start date</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                value={field.value ?? ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="expectedEndDate"
                                rules={{
                                    required: "Expected end date is required",
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expected end date</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                value={field.value ?? ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="reason"
                            rules={{ required: "Reason is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reason for acting</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. vacancy, maternity leave"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <FormLabel>Compensation</FormLabel>
                            <FormField
                                control={form.control}
                                name="compensationType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {COMPENSATION_OPTIONS.map((opt) => (
                                                    <SelectItem
                                                        key={opt.value}
                                                        value={opt.value}
                                                    >
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <CompensationInputs
                                allowances={allowances}
                                onAllowancesChange={setAllowances}
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                disabled={createMutation.isPending}
                            >
                                {createMutation.isPending
                                    ? "Creating…"
                                    : "Create assignment"}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/acting-assignments">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </main>
    );
}
