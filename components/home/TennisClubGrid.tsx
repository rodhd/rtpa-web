import { Club } from "@/lib/schema";
import TennisClubCard from "./TennisClubCard";

interface TennisClubGridProps {
    clubs: (Club & { courtCounts: Record<string, number> })[];
}

export default function TennisClubGrid({ clubs }: TennisClubGridProps) {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 m-10">
            {clubs.map((club, index) => (
                <TennisClubCard
                    key={index}
                    club={club}
                />
            ))}
        </div>
    );
}