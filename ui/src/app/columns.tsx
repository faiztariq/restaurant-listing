"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TableData = {
  id: string,
  restaurant: string,
  status: string,
  expectedStatus: string,
  opensAt: number,
}

export const columns: ColumnDef<TableData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "restaurant",
    header: "RESTAURANT",
  },
  {
    accessorKey: "status",
    header: "STATUS",
  },
  {
    accessorKey: "expectedStatus",
    header: "EXPECTED STATUS",
  },
  {
    accessorKey: "opensAt",
    header: "OPENS AT",
  },
]
