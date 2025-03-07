import EventForm, { EventFormValues } from "@/components/EventForm";
import { updateEvent } from "@/services/eventService";

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
      await updateEvent(event.id, data);
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
