import { Request, Response, NextFunction } from "express"
import { z } from "zod"
import { ValidationError, DatabaseError } from "../errors/customErrors"

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", err)

  // Handle Zod validation errors
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.errors,
    })
  }

  // Handle custom validation errors
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: "Validation error",
      details: err.message,
    })
  }

  // Handle custom database errors
  if (err instanceof DatabaseError) {
    return res.status(400).json({
      error: "Database error",
      details: err.message,
    })
  }

  // Handle other errors
  res.status(500).json({
    error: "Internal server error",
    details: err.message,
  })
}
