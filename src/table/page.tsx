import { useState } from "react";
import { Event, columns } from "./columns";
import { DataTable } from "./data-table";
import { useQuery } from "@tanstack/react-query";

async function getData(): Promise<Event[]> {
  const response = await fetch("/api/events");
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  return data.map((event: Event) => ({
    ...event,
    from: new Date(event.from).toISOString(),
    to: new Date(event.to).toISOString(),
  }));
}

export default function Table() {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: getData,
  });

  const filteredEventsQuery = useQuery({
    queryKey: ["filteredEvents", fromDate, toDate, eventsQuery.data],
    queryFn: () => {
      const data = eventsQuery.data || [];
      
      if (!fromDate && !toDate) return data;
      
      return data.filter(event => {
        const eventFromDate = new Date(event.from);
        const eventToDate = new Date(event.to);
        
        if (fromDate && eventFromDate < fromDate) {
          return false;
        }
        
        if (toDate && eventToDate > toDate) {
          return false;
        }
        
        return true;
      });
    },
    enabled: eventsQuery.isSuccess,
  });

  const isLoading = eventsQuery.isLoading;
  const error = eventsQuery.error;
  const refetch = eventsQuery.refetch;

  const data = filteredEventsQuery.data || [];
  const formattedData = data.map(event => ({
    ...event,
    from: new Date(event.from).toLocaleString(),
    to: new Date(event.to).toLocaleString(),
  }));

  return (
    <div className="container py-5">
      {isLoading ? (
        <div className="text-card-foreground text-center">Loading events...</div>
      ) : error ? (
        <div className="text-card-foreground text-center">Error: {error.message}</div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={formattedData}
            refreshData={refetch}
            dateRangeFilter={{
              fromDate,
              toDate,
              setFromDate,
              setToDate,
            }}
          />
        </>
      )}
    </div>
  );
}
