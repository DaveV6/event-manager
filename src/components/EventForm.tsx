"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { useState, useEffect } from "react";

export const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  desc: z.string().optional(),
  from: z.string().min(1, "Start date is required"),
  to: z.string().min(1, "End date is required"),
}).refine((data) => new Date(data.from) < new Date(data.to), {
  message: "End date must be after start date",
  path: ["to"],
});

export type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  defaultValues?: EventFormValues;
  onSubmit: SubmitHandler<EventFormValues>;
  submitButtonText: string;
  resetAfterSubmit?: boolean;
}

export default function EventForm({ 
  defaultValues, 
  onSubmit, 
  submitButtonText, 
  resetAfterSubmit = false 
}: EventFormProps) {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    defaultValues?.from ? new Date(defaultValues.from) : undefined
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    defaultValues?.to ? new Date(defaultValues.to) : undefined
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (fromDate) {
      setValue("from", fromDate.toISOString());
    }
  }, [fromDate, setValue]);

  useEffect(() => {
    if (toDate) {
      setValue("to", toDate.toISOString());
    }
  }, [toDate, setValue]);

  const handleFormSubmit: SubmitHandler<EventFormValues> = async (data) => {
    await onSubmit(data);
    if (resetAfterSubmit) {
      reset();
      setFromDate(undefined);
      setToDate(undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-card-foreground pb-2">
          Name
        </label>
        <Input
          id="name"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-500 pt-2">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-card-foreground pb-2">
          Description
        </label>
        <Input
          id="description"
          {...register("desc")}
        />
        {errors.desc && (
          <p className="text-sm text-red-500 pt-2">{errors.desc.message}</p>
        )}
      </div>
      
      {/* Hidden inputs to store the date values */}
      <input type="hidden" {...register("from")} />
      <input type="hidden" {...register("to")} />
      
      <DateTimePicker 
        date={fromDate} 
        setDate={setFromDate} 
        label="From"
      />
      {errors.from && (
        <p className="text-sm text-red-500 pb-2">{errors.from.message}</p>
      )}
      
      <DateTimePicker 
        date={toDate} 
        setDate={setToDate} 
        label="To"
      />
      {errors.to && (
        <p className="text-sm text-red-500 pb-2">{errors.to.message}</p>
      )}
      
      <Button className="mt-2" type="submit">
        {submitButtonText}
      </Button>
    </form>
  );
}
