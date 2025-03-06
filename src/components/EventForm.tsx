import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  desc: z.string().optional(),
  from: z.string().min(1, "Start date is required"),
  to: z.string().min(1, "End date is required"),
}).refine((data) => new Date(data.from) < new Date(data.to), {
  message: "End date must be after start date",
  path: ["to"],
})

export type EventFormValues = z.infer<typeof eventSchema>

interface EventFormProps {
  defaultValues?: EventFormValues
  onSubmit: SubmitHandler<EventFormValues>
  submitButtonText: string
  resetAfterSubmit?: boolean
}

export default function EventForm({ 
  defaultValues, 
  onSubmit, 
  submitButtonText, 
  resetAfterSubmit = false 
}: EventFormProps) {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    defaultValues?.from ? new Date(defaultValues.from) : undefined
  )
  const [toDate, setToDate] = useState<Date | undefined>(
    defaultValues?.to ? new Date(defaultValues.to) : undefined
  )

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: defaultValues,
  })

  useQuery({
    queryKey: ["fromDate", fromDate],
    queryFn: () => {
      if (fromDate) {
        form.setValue("from", fromDate.toISOString())
      }
      return ""
    },
    enabled: !!fromDate,
  })

  useQuery({
    queryKey: ["toDate", toDate],
    queryFn: () => {
      if (toDate) {
        form.setValue("to", toDate.toISOString())
      }
      return ""
    },
    enabled: !!toDate,
  })

  const handleFormSubmit: SubmitHandler<EventFormValues> = async (data) => {
    await onSubmit(data)
    if (resetAfterSubmit) {
      form.reset()
      setFromDate(undefined)
      setToDate(undefined)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Event Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Event Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* From Date Field */}
        <FormField
          control={form.control}
          name="from"
          render={({ field }) => (
            <FormItem>
              <FormLabel>From</FormLabel>
              <FormControl>
                <DateTimePicker
                  date={fromDate}
                  setDate={setFromDate}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* To Date Field */}
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>To</FormLabel>
              <FormControl>
                <DateTimePicker
                  date={toDate}
                  setDate={setToDate}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{submitButtonText}</Button>
      </form>
    </Form>
  )
}
