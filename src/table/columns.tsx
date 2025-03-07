import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteEvent } from "@/services/eventService";
import EditEventForm from "@/components/EditEventForm";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type Event = {
  id: number;
  name: string;
  desc?: string;
  from: string;
  to: string;
};

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "desc",
    header: "Description",
  },
  {
    accessorKey: "from",
    header: "From",
    cell: ({ row }) => {
      const date = new Date(row.original.from);
      return formatDateTime(date);
    },
  },
  {
    accessorKey: "to",
    header: "To",
    cell: ({ row }) => {
      const date = new Date(row.original.to);
      return formatDateTime(date);
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const event = row.original;
      const { refreshData } = table.options.meta; // Refresh the table data after an action
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State for delete dialog
      const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State for edit dialog

      // Handle event deletion
      const handleDelete = async () => {
        try {
          await deleteEvent(event.id); // Call the deleteEvent service
          refreshData(); // Refresh the table data after deletion
        } catch (error) {
          console.error("Error deleting event:", error);
        } finally {
          setIsDeleteDialogOpen(false);
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                Edit event
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                Delete Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the event.
                </DialogDescription>
              </DialogHeader>
              <Button className="w-fit" type="submit" onClick={handleDelete}>
                Delete Event
              </Button>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent aria-describedby={undefined}>
              <DialogTitle>Edit event</DialogTitle>
              <EditEventForm
                event={event}
                onEventUpdated={() => {
                  refreshData();
                  setIsEditDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];

// Custom function to format date and time as "dd/MM/yyyy, h:mm a"
function formatDateTime(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
}
