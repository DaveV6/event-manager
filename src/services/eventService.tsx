import { EventFormValues } from "@/lib/schemas";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch all events
export const getEvents = async () => {
  const response = await fetch(`${API_BASE_URL}/api/events`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

// Create a new event
export const createEvent = async (data: EventFormValues) => {
  const response = await fetch(`${API_BASE_URL}/api/events`, {
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

  return response.json();
};

// Update an existing event by ID
export const updateEvent = async (id: number, data: EventFormValues) => {
  const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
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

  return response.json();
};

// Delete an event by ID
export const deleteEvent = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete event");
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};
