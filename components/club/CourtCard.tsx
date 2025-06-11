import { Court } from "@/lib/schema";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface CourtCardProps {
  court: Court;
}

export function CourtCard({ court }: CourtCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{court.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
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
              court.surface === "hard" ? "bg-[#4a5759]" :
              court.surface === "clay" ? "bg-[#e4572e]" :
              court.surface === "grass" ? "bg-[#6a994e]" :
              "bg-[#b4654a]"
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
    </Card>
  );
} 