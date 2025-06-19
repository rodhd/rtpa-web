"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Reservation } from "@/lib/schema";

interface CourtAvailabilityProps {
  reservations: Reservation[];
}

export function CourtAvailability({
  reservations,
}: CourtAvailabilityProps) {
  const today = new Date();
  const days = Array.from({ length: 3 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const timeSlots: string[] = [];
  for (let hour = 8; hour < 22; hour++) {
    timeSlots.push(`${String(hour).padStart(2, "0")}:00`);
    timeSlots.push(`${String(hour).padStart(2, "0")}:30`);
  }

  const now = new Date();

  return (
    <TooltipProvider>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          {days.map((day) => {
            return (
              <div key={day.toISOString()}>
                <p className="text-sm font-medium mb-2">
                  {day.toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <div className="flex w-full h-4 rounded-md overflow-hidden border">
                  {timeSlots.map((slot) => {
                    const [hour, minute] = slot.split(":").map(Number);
                    const slotDateTime = new Date(day);
                    slotDateTime.setHours(hour, minute, 0, 0);

                    const slotEndDateTime = new Date(slotDateTime);
                    slotEndDateTime.setMinutes(slotDateTime.getMinutes() + 30);

                    const isReserved = reservations.some((reservation) => {
                      const reservationStart = new Date(reservation.startDate);
                      const reservationEnd = new Date(reservation.endDate);
                      // Check for overlap
                      return (
                        reservationStart < slotEndDateTime &&
                        reservationEnd > slotDateTime
                      );
                    });

                    const isInThePast = slotDateTime < now;

                    return (
                      <Tooltip key={slot} delayDuration={100}>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-full h-full ${
                              isInThePast
                                ? "bg-gray-400"
                                : isReserved
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{slot}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
} 