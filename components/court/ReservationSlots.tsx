"use client"

import { useState, useEffect } from "react";
import { format, addDays, setHours, setMinutes, isWithinInterval, setDate, setMonth, setYear } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Court, Reservation } from "@/lib/schema";
import { createReservation, getCourtReservations } from "@/app/actions";
import { useTransition } from "react";
import { ReservationForm } from "./ReservationForm";
import { cn } from "@/lib/utils";

const reservationFormSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});

type ReservationFormValues = z.infer<typeof reservationFormSchema>;

interface ReservationSlotsProps {
  court: Court;
}

export function ReservationSlots({ court }: ReservationSlotsProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [isPending, startTransition] = useTransition();
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [existingReservations, setExistingReservations] = useState<Reservation[]>([]);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  useEffect(() => {
    const fetchReservations = async () => {
      // Set start date to beginning of first day
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      
      // Set end date to end of third day
      const endDate = addDays(startDate, 2);
      endDate.setHours(23, 59, 59, 999);
      
      const reservations = await getCourtReservations(court.id, startDate, endDate);
      setExistingReservations(reservations);
    };

    fetchReservations();
  }, [court.id, selectedDate]);

  const generateTimeSlots = (date: Date) => {
    const slots = [];
    for (let hour = 8; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slot = new Date(date);
        slot.setHours(hour, minute, 0, 0);
        slots.push(slot);
      }
    }
    return slots;
  };

  const dates = [selectedDate, addDays(selectedDate, 1), addDays(selectedDate, 2)];

  const isSlotBooked = (date: Date, time: Date) => {
    return existingReservations.some(reservation => {
      const reservationStart = new Date(reservation.startDate);
      const reservationEnd = new Date(reservation.endDate);
      
      // Create slot start and end times using the correct date
      const slotStart = new Date(date);
      slotStart.setHours(time.getHours(), time.getMinutes(), 0, 0);
      
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotStart.getMinutes() + 30);

      // Check if the slot overlaps with the reservation
      return (
        (slotStart >= reservationStart && slotStart < reservationEnd) || // Slot starts during reservation
        (slotEnd > reservationStart && slotEnd <= reservationEnd) || // Slot ends during reservation
        (slotStart <= reservationStart && slotEnd >= reservationEnd) // Slot completely contains reservation
      );
    });
  };

  const handleSuccess = () => {
    setSelectedTime(null);
    setOpenPopoverId(null);
    // Refresh reservations for all three days
    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = addDays(selectedDate, 2);
    endDate.setHours(23, 59, 59, 999);
    getCourtReservations(court.id, startDate, endDate).then(setExistingReservations);
  }

  const handleCancel = () => {
    setSelectedTime(null);
    setOpenPopoverId(null);
  }

  const onSubmit = async (values: ReservationFormValues) => {
    startTransition(async () => {
      try {
        await createReservation({
          ...values,
          courtId: court.id,
        });
        // TODO: Add success notification
      } catch (error) {
        // TODO: Add error notification
        console.error(error);
      }
    });
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-4">
        {dates.map((date, dateIndex) => (
          <div key={dateIndex} className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">
              {format(date, "EEEE, MMMM d")}
            </h3>
            <div className="space-y-2">
              {generateTimeSlots(date).map((time, timeIndex) => {
                const popoverId = `${dateIndex}-${timeIndex}`;
                const isBooked = isSlotBooked(date, time);
                
                return (
                  <Popover 
                    key={timeIndex} 
                    open={openPopoverId === popoverId}
                    onOpenChange={(open) => {
                      if (!open) {
                        setOpenPopoverId(null);
                        setSelectedTime(null);
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          isBooked && "bg-red-100 hover:bg-red-200 text-red-900 cursor-not-allowed"
                        )}
                        onClick={() => {
                          if (isBooked) return;
                          setSelectedTime(time);
                          setOpenPopoverId(popoverId);
                          form.setValue("startDate", time);
                          form.setValue("endDate", new Date(time.getTime() + 60 * 60 * 1000)); // Add 1 hour
                        }}
                        disabled={isBooked}
                      >
                        {format(time, "HH:mm")}
                        {isBooked && " (Booked)"}
                      </Button>
                    </PopoverTrigger>
                    {!isBooked && (
                      <PopoverContent className="w-80">
                        <ReservationForm 
                          court={court} 
                          startTime={time} 
                          onSuccess={handleSuccess} 
                          onCancel={handleCancel} 
                        />
                      </PopoverContent>
                    )}
                  </Popover>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 