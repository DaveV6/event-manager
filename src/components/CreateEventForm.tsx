"use client";

import EventForm, { EventFormValues } from "@/components/EventForm";

interface CreateEventFormProps {
  onEventCreated: () => void;
}

export default function CreateEventForm({ onEventCreated }: CreateEventFormProps) {
  const handleSubmit = async (data: EventFormValues) => {
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

      onEventCreated();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <EventForm
      onSubmit={handleSubmit}
      submitButtonText="Create Event"
      resetAfterSubmit={true}
    />
  );
}
