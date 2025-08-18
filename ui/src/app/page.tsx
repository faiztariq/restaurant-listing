import { columns } from "./columns"
import { DataTable } from "./data-table"

async function loadData(): Promise<any> {
  let response = await fetch('http://localhost:3000/listings');

  let data = await response.json();

  const modifiedData: any = [];
  data.forEach((item: any) => {
    const epochOpensAt = item.opensAt
    item.opensAt = new Date(epochOpensAt);
    item.expectedStatus = new Date().getTime() - epochOpensAt > 0 ? 'Available' : 'Unavailable'
    modifiedData.push(item);
  });

  return modifiedData;
}

export default async function DemoPage() {

  const data = await loadData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
