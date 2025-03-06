"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: defaultValues,
  });

  const handleFormSubmit: SubmitHandler<EventFormValues> = async (data) => {
    await onSubmit(data);
    if (resetAfterSubmit) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-card-foreground">
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          className="mt-1 block w-full rounded-md border-border border shadow-sm py-2 px-4 text-card-foreground"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-card-foreground">
          Description
        </label>
        <input
          id="description"
          {...register("desc")}
          className="mt-1 block w-full rounded-md border-border border shadow-sm py-2 px-4 text-card-foreground"
        />
        {errors.desc && (
          <p className="text-sm text-red-500">{errors.desc.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="from" className="block text-sm font-medium text-card-foreground">
          From
        </label>
        <input
          type="datetime-local"
          id="from"
          {...register("from")}
          className="mt-1 block w-full rounded-md border-border border shadow-sm py-2 px-4 text-card-foreground"
        />
        {errors.from && (
          <p className="text-sm text-red-500">{errors.from.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="to" className="block text-sm font-medium text-card-foreground">
          To
        </label>
        <input
          type="datetime-local"
          id="to"
          {...register("to")}
          className="mt-1 block w-full rounded-md border-border border shadow-sm py-2 px-4 text-card-foreground"
        />
        {errors.to && (
          <p className="text-sm text-red-500">{errors.to.message}</p>
        )}
      </div>
      <Button className="mt-2" type="submit">
        {submitButtonText}
      </Button>
    </form>
  );
}
