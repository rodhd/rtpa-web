"use client";
import { Card } from "@/components/ui/card";
import {
  deleteReservation,
  getUserReservations,
} from "@/app/actions/reservations";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { Reservation, Court, Club, Match, MatchPlayer, MatchSet, Profile } from "@/lib/schema";
import { AddMatchResultDialog } from "../match/AddMatchResultDialog";
import { MatchResult } from "../match/MatchResult";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

type ReservationWithCourtAndClub = Reservation & {
  court: Court & {
    club: Club;
  };
  match:
    | (Match & {
        matchPlayers: (MatchPlayer & {
          profile: Profile | null;
        })[];
        matchSets: MatchSet[];
      })
    | null;
};

type ReservationCardProps = {
  reservation: ReservationWithCourtAndClub;
};

export function ReservationCard({ reservation }: ReservationCardProps) {
  const isPast = new Date(reservation.endDate) < new Date();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    startTransition(async () => {
      await deleteReservation(reservation.id);
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card
        className={cn(
          "p-4",
          isPast && "bg-gray-100 text-gray-500"
        )}
      >
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <p className="font-bold">{reservation.court.club.name}</p>
            <p>Court: {reservation.court.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <p>
                {new Date(reservation.startDate).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
              <p>
                {new Date(reservation.endDate).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
            {!isPast && (
              <form action={handleDelete}>
                <Button
                  variant="destructive"
                  size="sm"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? "Deleting..." : "Delete"}
                </Button>
              </form>
            )}
            {isPast && !reservation.match && (
              <AddMatchResultDialog reservation={reservation} />
            )}
            {reservation.match && (
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm">
                  {isOpen ? "Hide Result" : "View Result"}
                </Button>
              </CollapsibleTrigger>
            )}
          </div>
        </div>
        {reservation.match && (
          <CollapsibleContent>
            <MatchResult match={reservation.match} />
          </CollapsibleContent>
        )}
      </Card>
    </Collapsible>
  );
} 