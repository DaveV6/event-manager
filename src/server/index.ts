import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Event schema for events
const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  desc: z.string().optional(),
  from: z.string().min(1, "Start date is required"),
  to: z.string().min(1, "End date is required"),
});

// API endpoint to fetch events
app.get("/api/events", async (req, res) => {
  const events = await prisma.event.findMany();
  res.json(events);
});

// API endpoint to create a new event
app.post("/api/events", async (req, res) => {
  const { name, desc, from, to } = req.body;

  try {
    const newEvent = await prisma.event.create({
      data: {
        name,
        desc,
        from: new Date(from),
        to: new Date(to),
      },
    });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// API endpoint to delete an event
app.delete("/api/events/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.event.delete({
      where: { id: Number(id) }, // Convert id to a number
    });
    res.status(204).send(); // No content response
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// API endpoint to update an event
app.put("/api/events/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const validatedData = eventSchema.parse(req.body);
    const updatedEvent = await prisma.event.update({
      where: { id: Number(id) }, // Convert id to a number
      data: {
        name: validatedData.name,
        desc: validatedData.desc,
        from: new Date(validatedData.from),
        to: new Date(validatedData.to)
      },
    });
    res.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
