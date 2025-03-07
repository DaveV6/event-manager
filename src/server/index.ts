import express from "express"
import cors from "cors"
import eventsRouter from "../routes/events"
import { errorHandler } from "../middleware/errorHandler"

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use("/api/events", eventsRouter)
app.use(errorHandler as express.ErrorRequestHandler)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
