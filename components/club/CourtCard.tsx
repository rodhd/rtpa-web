"use client";

import { Court, Reservation } from "@/lib/schema";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { ChevronsUpDown } from "lucide-react";
import { CourtAvailability } from "./CourtAvailability";
import { useRouter } from "next/navigation";

interface CourtCardProps {
  court: Court;
  reservations: Reservation[];
}

export function CourtCard({ court, reservations }: CourtCardProps) {
  const router = useRouter();

  return (
    <Collapsible>
      <Card
        className="rounded-lg cursor-pointer hover:bg-slate-100"
        onClick={() => router.push(`/clubs/${court.clubId}/courts/${court.id}`)}
      >
        <div className="flex items-center justify-between p-6">
          <CardTitle className="text-lg">{court.name}</CardTitle>
          <CollapsibleTrigger
            asChild
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <CardContent className="space-y-2 pt-0">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={cn(
                "capitalize text-white",
                court.type === "tennis" ? "bg-[#c1121f]" : "bg-[#669bbc]"
              )}
            >
              {court.type}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "capitalize text-white",
                court.surface === "hard"
                  ? "bg-[#4a5759]"
                  : court.surface === "clay"
                  ? "bg-[#e4572e]"
                  : court.surface === "grass"
                  ? "bg-[#6a994e]"
                  : "bg-[#b4654a]"
              )}
            >
              {court.surface}
            </Badge>
            <Badge
              variant="outline"
              className="capitalize bg-gray-600 text-white"
            >
              {court.location}
            </Badge>
          </div>
        </CardContent>
        <CollapsibleContent
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <CourtAvailability reservations={reservations} />
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
} 