import { EventFormValues } from "@/components/EventForm";

/**
 * Create a new event
 */
export const createEvent = async (data: EventFormValues): Promise<void> => {
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
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

/**
 * Update an existing event
 */
export const updateEvent = async (id: number, data: EventFormValues): Promise<void> => {
  try {
    const response = await fetch(`/api/events/${id}`, {
      method: "PUT",
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
      throw new Error("Failed to update event");
    }
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};
