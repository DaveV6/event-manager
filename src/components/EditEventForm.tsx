"use client";

import EventForm, { EventFormValues } from "@/components/EventForm";

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
  const defaultValues: EventFormValues = {
    name: event.name,
    desc: event.desc,
    from: new Date(event.from).toISOString().slice(0, 16),
    to: new Date(event.to).toISOString().slice(0, 16),
  };

  const handleSubmit = async (data: EventFormValues) => {
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
    <EventForm
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitButtonText="Save Changes"
    />
  );
}
