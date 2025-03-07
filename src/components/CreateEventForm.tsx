import EventForm, { EventFormValues } from "@/components/EventForm";
import { createEvent } from "@/services/eventService";

interface CreateEventFormProps {
  onEventCreated: () => void;
}

export default function CreateEventForm({ onEventCreated }: CreateEventFormProps) {
  const handleSubmit = async (data: EventFormValues) => {
    try {
      await createEvent(data);
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
