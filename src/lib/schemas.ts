import { z } from "zod"

// Define the event schema
export const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  desc: z.string().optional(),
  from: z.string().min(1, "Start date is required"),
  to: z.string().min(1, "End date is required"),
}).refine((data) => new Date(data.from) < new Date(data.to), {
  message: "End date must be after start date",
  path: ["to"],
})

export type EventFormValues = z.infer<typeof eventSchema>
