"use client"

import { toggleCourtStatus } from "@/app/actions/courts";
import { Court } from "@/lib/schema";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { EditCourtDialog } from "./EditCourtDialog";

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
  {
    accessorKey: "active",
    header: () => <div className="font-bold">Status</div>,
    cell: ({ row }) => {
      const active = row.getValue("active");
      const style = active ? "bg-green-500 text-white" : "bg-red-500 text-white";
      return <Badge variant="outline" className={cn(style)}>{active ? "Active" : "Inactive"}</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const court = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <EditCourtDialog court={court} />
            <DropdownMenuItem onClick={() => toggleCourtStatus(court.id, !court.active, court.clubId)}>
              {court.active ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => console.log("Delete court")}>
              Delete
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]