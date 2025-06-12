"use client"

import { useState } from "react";
import { format, addDays, setHours, setMinutes } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Court } from "@/lib/schema";
import { createReservation } from "@/app/actions";
import { useTransition } from "react";

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

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(setMinutes(setHours(new Date(), hour), minute));
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const dates = [selectedDate, addDays(selectedDate, 1), addDays(selectedDate, 2)];

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
              {timeSlots.map((time, timeIndex) => (
                <Popover key={timeIndex}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      onClick={() => {
                        setSelectedTime(time);
                        form.setValue("startDate", setMinutes(setHours(date, time.getHours()), time.getMinutes()));
                        form.setValue("endDate", setMinutes(setHours(date, time.getHours() + 1), time.getMinutes()));
                      }}
                    >
                      {format(time, "HH:mm")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="text-sm">
                          <p>Court: {court.name}</p>
                          <p>Type: {court.type}</p>
                          <p>Surface: {court.surface}</p>
                          <p>Location: {court.location}</p>
                        </div>
                        <Button type="submit" className="w-full" disabled={isPending}>
                          {isPending ? "Creating..." : "Make Reservation"}
                        </Button>
                      </form>
                    </Form>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 