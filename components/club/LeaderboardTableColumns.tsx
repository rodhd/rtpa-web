"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LeaderboardEntry } from "@/app/actions/clubs";
import Image from "next/image";



export const columns: ColumnDef<LeaderboardEntry>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
    cell: ({ row }) => {
      return row.index + 1;
    },
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "matchesPlayed",
    header: "Matches Played",
  },
  {
    accessorKey: "matchesWon",
    header: "Matches Won",
  },
  {
    accessorKey: "setsWon",
    header: "Sets Won",
  },
  {
    accessorKey: "gamesWon",
    header: "Games Won",
  },
  {
    accessorKey: "score",
    header: "Score",
  },
]; 