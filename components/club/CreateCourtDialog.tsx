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
import { Button } from "../ui/button";
import { useState } from "react";

export function CreateCourtDialog({ clubId }: { clubId: string }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Court</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new court</DialogTitle>
                    <DialogDescription>
                        Fill in the form below to create a new court.
                    </DialogDescription>
                </DialogHeader>
                <CreateCourtForm clubId={clubId} closeDialog={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
} 