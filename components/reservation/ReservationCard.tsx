"use client";
import { Card } from "@/components/ui/card";
import {
  deleteReservation,
  getUserReservations,
} from "@/app/actions/reservations";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useTransition } from "react";

type ReservationCardProps = {
  reservation: Awaited<ReturnType<typeof getUserReservations>>[0];
};

export function ReservationCard({ reservation }: ReservationCardProps) {
  const isPast = new Date(reservation.endDate) < new Date();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      await deleteReservation(reservation.id);
    });
  };

  return (
    <Card
      className={cn(
        "p-4 flex flex-row items-center justify-between",
        isPast && "bg-gray-100 text-gray-500"
      )}
    >
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
      </div>
    </Card>
  );
} 