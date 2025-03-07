import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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

import { eventSchema, EventFormValues } from "@/lib/schemas"

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
  // State for the start date
  const [fromDate, setFromDate] = useState<Date | undefined>(
    // If defaultValues has a from date, set it as the initial value else set it to undefined
    defaultValues?.from ? new Date(defaultValues.from) : undefined
  )
  // State for the end date
  const [toDate, setToDate] = useState<Date | undefined>(
    // If defaultValues has a to date, set it as the initial value else set it to undefined
    defaultValues?.to ? new Date(defaultValues.to) : undefined
  )

  // Form hook
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema), // Use zod resolver for form validation
    defaultValues: defaultValues, // Set default values for the form
  })

  // Query to update the from date field when the fromDate state changes
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

  // Query to update the to date field when the toDate state changes
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
