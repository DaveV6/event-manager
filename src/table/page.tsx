import { Event, columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";

async function getData(): Promise<Event[]> {
  const response = await fetch('http://localhost:5000/api/events');
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
}

export default function Table() {
  const [data, setData] = useState<Event[]>([]);

  useEffect(() => {
    getData().then((data) => setData(data));
  }, []);

  return (
    <div className="py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
