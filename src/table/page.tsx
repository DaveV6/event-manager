"use client";

import { Event, columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CreateEventForm from "@/components/CreateEventForm";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

async function getData(): Promise<Event[]> {
  const response = await fetch("/api/events");
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  return data.map((event: Event) => ({
    ...event,
    from: new Date(event.from).toLocaleString(),
    to: new Date(event.to).toLocaleString(),
  }));
}

export default function Table() {
  const [data, setData] = useState<Event[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility

  const fetchData = async () => {
    const events = await getData();
    setData(events);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} refreshData = {fetchData} />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="my-4">Add event</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add new event</DialogTitle>
          <CreateEventForm
            onEventCreated={() => {
              fetchData(); // Refresh the table
              setIsDialogOpen(false); // Close the dialog
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
