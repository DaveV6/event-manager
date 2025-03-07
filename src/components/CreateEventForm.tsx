import EventForm from "@/components/EventForm"
import { useMutation } from "@tanstack/react-query"
import { createEvent } from "@/services/eventService"
import { EventFormValues } from "@/lib/schemas"

interface CreateEventFormProps {
  onEventCreated: () => void
}

export default function CreateEventForm({ onEventCreated }: CreateEventFormProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      onEventCreated()
    },
    onError: (error) => {
      (`Error creating event: ${error.message}`)
    },
  })

  const handleSubmit = async (data: EventFormValues) => {
    mutate(data)
  }

  return (
    <EventForm
      onSubmit={handleSubmit}
      submitButtonText={isPending ? "Creating..." : "Create Event"}
      resetAfterSubmit={true}
    />
  )
}
