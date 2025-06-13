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
import { ReservationForm } from "./ReservationForm";

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

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(setMinutes(setHours(new Date(), hour), minute));
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const dates = [selectedDate, addDays(selectedDate, 1), addDays(selectedDate, 2)];

  const handleSuccess = () => {
    setSelectedTime(null);
    setOpenPopoverId(null);
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
              {timeSlots.map((time, timeIndex) => {
                const popoverId = `${dateIndex}-${timeIndex}`;
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
                        className="w-full justify-start text-left font-normal"
                        onClick={() => {
                          setSelectedTime(time);
                          setOpenPopoverId(popoverId);
                          form.setValue("startDate", setMinutes(setHours(date, time.getHours()), time.getMinutes()));
                          form.setValue("endDate", setMinutes(setHours(date, time.getHours() + 1), time.getMinutes()));
                        }}
                      >
                        {format(time, "HH:mm")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <ReservationForm 
                        court={court} 
                        startTime={time} 
                        onSuccess={handleSuccess} 
                        onCancel={handleCancel} 
                      />
                    </PopoverContent>
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