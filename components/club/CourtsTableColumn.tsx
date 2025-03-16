"use client"

import { Court } from "@/lib/schema";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export const CourtsTableColumns: ColumnDef<Court>[] = [
  {
    accessorKey: "name",
    header: () => <div className="font-bold">Name</div>,
  },
  {
    accessorKey: "type",
    header: () => <div className="font-bold">Type</div>,
    cell: ({ row }) => {
      const formatted = (row.getValue("type") as string);
      let style = "capitalize text-white";
      switch (row.getValue("type")) {
        case "tennis":
          style += " bg-[#c1121f]";
          break;
        case "paddel":
          style += " bg-[#669bbc]"
          break;
      }
      
      return <Badge variant="outline" className={cn(style)}>{formatted}</Badge>
    }
  },
  {
    accessorKey: "surface",
    header: () => <div className="font-bold">Surface</div>,
    cell: ({ row }) => {
      const formatted = String(row.getValue("surface"));
      let style = "capitalize text-white";
      switch (formatted) {
        case "hard":
          style += " bg-[#4a5759]";
          break;
        case "clay":
          style += " bg-[#e4572e]";
          break;
        case "grass":
          style += " bg-[#6a994e]";
          break;
        case "carpet":
          style += " bg-[#b4654a]";
          break;
      }
      
      return <Badge variant="outline" className={cn(style)}>{formatted}</Badge>
    }
  },
  {
    accessorKey: "location",
    header: () => <div className="font-bold">Location</div>,
    cell: ({ row }) => {
      const formatted = String(row.getValue("location"));
      let style = "capitalize text-white";
      switch (formatted) {
        case "outdoor":
          style += " bg-[#feb42d]";
          break;
        case "indoor":
          style += " bg-[#c2c5bb]";
          break;
      }
      
      return <Badge variant="outline" className={cn(style)}>{formatted}</Badge>
    }
  },
]