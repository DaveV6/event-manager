"use client";

import { Button } from "./ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  desc: z.string().optional(),
  from: z.string().min(1, "Start date is required"),
  to: z.string().min(1, "End date is required"),
}).refine((data) => new Date(data.from) < new Date(data.to), {
  message: "End date must be after start date",
  path: ["to"],
});

type EventFormValues = z.infer<typeof eventSchema>;

interface CreateEventFormProps {
  onEventCreated: () => void;
}

export default function CreateEventForm({ onEventCreated }: CreateEventFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
  });

  const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          desc: data.desc,
          from: new Date(data.from).toISOString(),
          to: new Date(data.to).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      reset();

      onEventCreated();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <input
          id="description"
          {...register("desc")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.desc && (
          <p className="text-sm text-red-500">{errors.desc.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="from" className="block text-sm font-medium text-gray-700">
          From
        </label>
        <input
          type="datetime-local"
          id="from"
          {...register("from")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.from && (
          <p className="text-sm text-red-500">{errors.from.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="to" className="block text-sm font-medium text-gray-700">
          To
        </label>
        <input
          type="datetime-local"
          id="to"
          {...register("to")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.to && (
          <p className="text-sm text-red-500">{errors.to.message}</p>
        )}
      </div>
      <Button type="submit">
        Create Event
      </Button>
    </form>
  );
}
