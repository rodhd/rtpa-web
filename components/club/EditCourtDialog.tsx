"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CreateCourtForm } from "./CreateCourtForm";
import { useState } from "react";
import { Court } from "@/lib/schema";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export function EditCourtDialog({ court }: { court: Court }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit court</DialogTitle>
                    <DialogDescription>
                        Fill in the form below to edit the court.
                    </DialogDescription>
                </DialogHeader>
                <CreateCourtForm clubId={String(court.clubId)} closeDialog={() => setOpen(false)} court={court} />
            </DialogContent>
        </Dialog>
    );
} 