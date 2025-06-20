"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { AddMatchResultForm } from "./AddMatchResultForm";
import { Reservation, Court, Club, Match } from "@/lib/schema";

type ReservationWithCourtAndClub = Reservation & {
  court: Court & {
    club: Club;
  };
  match: Match | null;
};

export function AddMatchResultDialog({
  reservation,
}: {
  reservation: ReservationWithCourtAndClub;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Result</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Match Result</DialogTitle>
          <DialogDescription>
            Enter the details of your match to save the result.
          </DialogDescription>
        </DialogHeader>
        <AddMatchResultForm reservation={reservation} />
      </DialogContent>
    </Dialog>
  );
} 