"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Court } from "@/lib/schema"
import { useTransition, useState } from "react"
import { createReservation } from "@/app/actions"

const reservationFormSchema = z.object({
  duration: z.enum(["30", "60", "90", "120"]),
})

type ReservationFormProps = {
  court: Court
  startTime: Date
  onSuccess?: () => void
  onCancel?: () => void
}

export function ReservationForm({ court, startTime, onSuccess, onCancel }: ReservationFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm<z.infer<typeof reservationFormSchema>>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      duration: "60", // Default to 1 hour
    },
  })

  const handleCancel = () => {
    setError(null)
    setSuccess(false)
    onCancel?.()
  }

  const onSubmit = async (values: z.infer<typeof reservationFormSchema>) => {
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      try {
        const durationInMinutes = parseInt(values.duration)
        const endTime = new Date(startTime.getTime() + durationInMinutes * 60000)

        await createReservation({
          courtId: court.id,
          startDate: startTime,
          endDate: endTime,
        })

        setSuccess(true)
        // Close the popover after a short delay to show the success message
        setTimeout(() => {
          onSuccess?.()
        }, 1500)
      } catch (error) {
        console.error("Failed to create reservation:", error)
        setError("Failed to create reservation. Please try again.")
      }
    })
  }

  if (success) {
    return (
      <div className="p-4 text-center">
        <p className="text-green-600 font-medium">Reservation created successfully!</p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {error && (
          <div className="text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Reservation"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
