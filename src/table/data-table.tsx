import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CreateEventForm from "@/components/CreateEventForm"
import { DateTimePicker } from "@/components/ui/date-time-picker"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  refreshData: () => void
  dateRangeFilter?: {
    fromDate: Date | undefined
    toDate: Date | undefined
    setFromDate: (date: Date | undefined) => void
    setToDate: (date: Date | undefined) => void
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  refreshData,
  dateRangeFilter
}: DataTableProps<TData, TValue>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters
    },
    meta: { refreshData }
  })

  return (
    <>
      <div className="grid grid-cols-12 py-4 items-end gap-8">
        <div className="col-span-12 lg:col-span-10 flex items-end gap-4 flex-wrap md:flex-nowrap">
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-xs"
          />
          {dateRangeFilter && (
            <div className="grid grid-cols-2 gap-4 w-full">
              <div>
                <div className="mb-2 font-medium text-card-foreground">From</div>
                <DateTimePicker 
                  date={dateRangeFilter.fromDate} 
                  setDate={dateRangeFilter.setFromDate} 
                />
              </div>
              <div>
                <div className="mb-2 font-medium text-card-foreground">To</div>
                <DateTimePicker 
                  date={dateRangeFilter.toDate} 
                  setDate={dateRangeFilter.setToDate} 
                />
              </div>
            </div>
          )}
        </div>
        <Button 
          className="col-span-12 lg:col-span-2"
          onClick={() => {
            dateRangeFilter?.setFromDate(undefined)
            dateRangeFilter?.setToDate(undefined)
            table.getColumn("name")?.setFilterValue("")
          }}
        >
          Reset Filters
        </Button>
      </div>

      <div className="rounded-md border border-border bg-card text-card-foreground shadow">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between">      
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="my-4">Add event</Button>
          </DialogTrigger>
          <DialogContent aria-describedby={undefined}>
            <DialogTitle>Add new event</DialogTitle>
            <CreateEventForm
              onEventCreated={() => {
                refreshData()
                setIsDialogOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  )
}
