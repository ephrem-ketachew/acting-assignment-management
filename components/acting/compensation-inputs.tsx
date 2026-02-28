"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

export interface CreateFormValues {
    employeeId: string;
    employeeName: string;
    currentPosition: string;
    actingPosition: string;
    actingDepartment: string;
    startDate: string;
    expectedEndDate: string;
    reason: string;
    compensationType: "fixed" | "percentage" | "allowance" | "multiple";
    compensationAmount?: number;
    compensationPercent?: number;
}

interface CompensationInputsProps {
    allowances: { name: string; amount: number }[];
    onAllowancesChange: (a: { name: string; amount: number }[]) => void;
}

export function CompensationInputs({
    allowances,
    onAllowancesChange,
}: CompensationInputsProps): React.ReactElement {
    const form = useFormContext<CreateFormValues>();
    const type = form.watch("compensationType");

    const addAllowance = (): void => {
        onAllowancesChange([...allowances, { name: "", amount: 0 }]);
    };

    const removeAllowance = (index: number): void => {
        onAllowancesChange(allowances.filter((_, i) => i !== index));
    };

    const updateAllowance = (
        index: number,
        field: "name" | "amount",
        value: string | number
    ): void => {
        const next = [...allowances];
        if (field === "name") {
            next[index] = { ...next[index], name: String(value) };
        } else {
            next[index] = { ...next[index], amount: Number(value) || 0 };
        }
        onAllowancesChange(next);
    };

    if (type === "fixed" || type === "allowance") {
        return (
            <FormField
                control={form.control}
                name="compensationAmount"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            {type === "fixed" ? "Amount" : "Allowance amount"}
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                min={0}
                                step={0.01}
                                placeholder="0"
                                value={field.value === undefined ? "" : field.value}
                                onChange={(e) =>
                                    field.onChange(
                                        e.target.value === ""
                                            ? undefined
                                            : Number(e.target.value)
                                    )
                                }
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
        );
    }

    if (type === "percentage") {
        return (
            <FormField
                control={form.control}
                name="compensationPercent"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Percentage</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                step={0.1}
                                placeholder="0"
                                value={field.value === undefined ? "" : field.value}
                                onChange={(e) =>
                                    field.onChange(
                                        e.target.value === ""
                                            ? undefined
                                            : Number(e.target.value)
                                    )
                                }
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
        );
    }

    if (type === "multiple") {
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label>Allowances</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addAllowance}
                    >
                        Add row
                    </Button>
                </div>
                {allowances.map((row, index) => (
                    <div
                        key={index}
                        className="flex flex-wrap items-center gap-2 rounded border p-2"
                    >
                        <Input
                            placeholder="Name"
                            value={row.name}
                            onChange={(e) =>
                                updateAllowance(index, "name", e.target.value)
                            }
                            className="min-w-[120px] flex-1"
                        />
                        <Input
                            type="number"
                            min={0}
                            step={0.01}
                            placeholder="Amount"
                            value={row.amount === 0 ? "" : row.amount}
                            onChange={(e) =>
                                updateAllowance(
                                    index,
                                    "amount",
                                    e.target.value === ""
                                        ? 0
                                        : e.target.value
                                )
                            }
                            className="w-[120px]"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAllowance(index)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
            </div>
        );
    }

    return <></>;
}
