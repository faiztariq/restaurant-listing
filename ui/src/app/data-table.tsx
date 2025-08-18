"use client"
import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[];
}

async function myFunction() {
  let response = await fetch('http://localhost:3000/listings');

  await setTimeout(() => { }, 2000);

  let listingData = await response.json();

  const newListing = {
    "id": `${listingData.length + 1}`,
    "restaurant": `My Restaurant ${listingData.length + 1}`,
    "status": Math.random() < 0.5 ? "Unavailable" : "Available",
    "opensAt": (new Date().getTime() + (((Math.random() < 0.5 ? 1 : -1) * 1000) * 60 * 10))
  };
  const refreshRequest = new Request("http://localhost:3000/listings", {
    method: "POST",
    body: JSON.stringify(newListing),
  });

  await fetch(refreshRequest);
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {

  const [filterColName, setFilterColName] = React.useState('id');
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters
    },
  });

  const colData = table.getAllColumns().map((itm) => {
    return { value: itm.id, text: itm.id };
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <div>
          <Input
            placeholder={`Filter by ${filterColName}...`}
            value={(table.getColumn(filterColName)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(filterColName)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div>
          <Select onValueChange={(value) => { setFilterColName(value) }}>
            <SelectTrigger className="w-[180px] ml-2">
              <SelectValue placeholder="Filter By" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filter By</SelectLabel>
                {colData.map((itm) => {
                  return (
                    <SelectItem key={itm.value} value={itm.value}>{itm.text}</SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button className="w-[80px] ml-2" onClick={myFunction}>Refresh</Button>
        </div>
      </div>
      <div className="rounded-md border">
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
    </div>
  )
}
