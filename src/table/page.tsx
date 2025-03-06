"use client";

import { Event, columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";

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

  const fetchData = async () => {
    const events = await getData();
    setData(events);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container py-5">
      <DataTable 
        columns={columns} 
        data={data} 
        refreshData={fetchData} 
      />
    </div>
  );
}
