"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
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
} from "@/components/ui/select"
import { createCourtSchema, createCourtSchemaType } from "@/lib/zodSchemas";
import { Court, courtSurfaceEnum, courtLocationEnum, courtTypeEnum } from "@/lib/schemas/courts";
import { createCourt, updateCourt } from "@/app/actions/courts";
import { useTransition } from "react";

const surfaceColorMap: Record<string, string> = {
    clay: 'bg-orange-600',
    grass: 'bg-green-600',
    hard: 'bg-blue-600',
};

const typeColorMap: Record<string, string> = {
    tennis: 'bg-yellow-400',
    paddel: 'bg-cyan-400',
};

const locationColorMap: Record<string, string> = {
    indoor: 'bg-slate-500',
    outdoor: 'bg-amber-400',
};

export function CreateCourtForm({ clubId, closeDialog, court }: { clubId: string, closeDialog: () => void, court?: Court }) {
    const [isPending, startTransition] = useTransition();
    const isEditMode = court !== undefined;

    const form = useForm<createCourtSchemaType>({
        resolver: zodResolver(createCourtSchema),
        defaultValues: {
            name: court?.name ?? "",
            type: court?.type ?? "tennis",
            surface: court?.surface ?? "clay",
            location: court?.location ?? "outdoor",
        },
    });

    const onSubmit = async (values: createCourtSchemaType) => {
        startTransition(async () => {
            if (isEditMode) {
                const result = await updateCourt(court.id, clubId, values);
                if (result?.success) {
                    closeDialog();
                }
            } else {
                const result = await createCourt(clubId, values);
                if (result?.success) {
                    closeDialog();
                }
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Court Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Court 1" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue>
                                            <div className="flex items-center gap-2">
                                                <span className="capitalize">{field.value}</span>
                                                <div className={`h-2 w-2 rounded-full ${typeColorMap[field.value]}`} />
                                            </div>
                                        </SelectValue>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {courtTypeEnum.enumValues.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            <div className="flex items-center gap-2">
                                                <span className="capitalize">{type}</span>
                                                <div className={`h-2 w-2 rounded-full ${typeColorMap[type]}`} />
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="surface"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Surface</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue>
                                            <div className="flex items-center gap-2">
                                                <span className="capitalize">{field.value}</span>
                                                <div className={`h-2 w-2 rounded-full ${surfaceColorMap[field.value]}`} />
                                            </div>
                                        </SelectValue>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {courtSurfaceEnum.enumValues.map((surface) => (
                                        <SelectItem key={surface} value={surface}>
                                            <div className="flex items-center gap-2">
                                                <span className="capitalize">{surface}</span>
                                                <div className={`h-2 w-2 rounded-full ${surfaceColorMap[surface]}`} />
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue>
                                            <div className="flex items-center gap-2">
                                            <   span className="capitalize">{field.value}</span>
                                                <div className={`h-2 w-2 rounded-full ${locationColorMap[field.value]}`} />
                                            </div>
                                        </SelectValue>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {courtLocationEnum.enumValues.map((location) => (
                                        <SelectItem key={location} value={location}>
                                            <div className="flex items-center gap-2">
                                            <span className="capitalize">{location}</span>
                                                <div className={`h-2 w-2 rounded-full ${locationColorMap[location]}`} />
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Court" : "Create Court")}
                </Button>
            </form>
        </Form>
    );
} 