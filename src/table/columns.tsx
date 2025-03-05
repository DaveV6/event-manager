"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Event = {
  id: number
  name: string
  description?: string
  from: Date
  to: Date
}

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "from",
    header: "From",
  },
  {
    accessorKey: "to",
    header: "To",
  }
]
