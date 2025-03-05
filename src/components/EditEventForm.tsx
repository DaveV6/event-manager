"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";

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

interface EditEventFormProps {
  event: {
    id: number;
    name: string;
    desc?: string;
    from: string;
    to: string;
  };
  onEventUpdated: () => void;
}

export default function EditEventForm({ event, onEventUpdated }: EditEventFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: event.name,
      desc: event.desc,
      from: new Date(event.from).toISOString().slice(0, 16), // Convert to local datetime string
      to: new Date(event.to).toISOString().slice(0, 16),
    },
  });

  const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          desc: data.desc,
          from: data.from,
          to: data.to,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      onEventUpdated();
    } catch (error) {
      console.error("Error updating event:", error);
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
        <label htmlFor="desc" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <input
          id="desc"
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
      <Button type="submit">Save Changes</Button>
    </form>
  );
}
