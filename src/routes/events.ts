import express from "express"
import { PrismaClient } from "@prisma/client"
import { eventSchema } from "@/lib/schemas"
import { z } from "zod"
import { ValidationError, DatabaseError } from "../errors/customErrors"

const router = express.Router()
const prisma = new PrismaClient()

// API endpoint to fetch events
router.get("/", async (req, res, next) => {
  try {
    const events = await prisma.event.findMany()
    res.json(events)
  } catch (error) {
    next(error)
  }
})

// API endpoint to create a new event
router.post("/", async (req, res, next) => {
  try {
    const validatedData = eventSchema.parse(req.body)
    const newEvent = await prisma.event.create({
      data: {
        name: validatedData.name,
        desc: validatedData.desc,
        from: new Date(validatedData.from),
        to: new Date(validatedData.to),
      },
    })
    res.status(201).json(newEvent)
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ValidationError("Invalid input data"))
    } else {
      next(new DatabaseError("Failed to create event"))
    }
  }
})

// API endpoint to delete an event
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params

  try {
    await prisma.event.delete({
      where: { id: Number(id) }, // Convert id to a number
    })
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

// API endpoint to update an event
router.put("/:id", async (req, res, next) => {
  const { id } = req.params

  try {
    const validatedData = eventSchema.parse(req.body)
    const updatedEvent = await prisma.event.update({
      where: { id: Number(id) }, // Convert id to a number
      data: {
        name: validatedData.name,
        desc: validatedData.desc,
        from: new Date(validatedData.from),
        to: new Date(validatedData.to),
      },
    })
    res.json(updatedEvent)
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ValidationError("Invalid input data"))
    } else {
      next(new DatabaseError("Failed to create event"))
    }
  }
})

export default router
