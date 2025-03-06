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
    from: new Date(event.from).toLocaleString(),
    to: new Date(event.to).toLocaleString(),
  }));
}

export default function Table() {
  const { 
    data = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["events"],
    queryFn: getData,
  });

  return (
    <div className="container py-5">
      {isLoading ? (
        <div className="text-card-foreground text-center">Loading events...</div>
      ) : error ? (
        <div className="text-card-foreground text-center">Error loading events: {(error as Error).message}</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={data} 
          refreshData={() => refetch()} 
        />
      )}
    </div>
  );
}
