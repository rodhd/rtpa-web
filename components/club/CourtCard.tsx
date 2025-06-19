import { Court } from "@/lib/schema";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { ChevronsUpDown } from "lucide-react";
import { CourtAvailability } from "./CourtAvailability";

interface CourtCardProps {
  court: Court;
}

export function CourtCard({ court }: CourtCardProps) {
  return (
    <Collapsible>
      <Card className="rounded-lg">
        <div className="flex items-center justify-between p-6">
          <Link
            href={`/clubs/${court.clubId}/courts/${court.id}`}
            className="hover:underline"
          >
            <CardTitle className="text-lg">{court.name}</CardTitle>
          </Link>
          <CollapsibleTrigger asChild>
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
        <CollapsibleContent>
          <CourtAvailability />
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
} 