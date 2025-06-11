import Image from 'next/image';
import { Club } from "@/lib/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface TennisClubCardProps {
    club: Club & { courtCounts: Record<string, number> };
};

export default function TennisClubCard({ club }: TennisClubCardProps) {
    return (
        <Card className='w-full max-w-sm'>
            <CardHeader>
                <CardTitle>{club.name}</CardTitle>
                <CardDescription>{club.address}</CardDescription>
            </CardHeader>
            <CardContent>
                <Image src={club.imageUrl || '/default-club-image.jpg'} alt={club.name} width={500} height={300} className="rounded-md" />
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
                {Object.entries(club.courtCounts).map(([type, count]) => (
                    <div key={type} className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground capitalize">
                            {type}
                        </span>
                        <Badge 
                            variant={type === 'tennis' ? 'default' : 'secondary'}
                            className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                        >
                            {count}
                        </Badge>
                    </div>
                ))}
            </CardFooter>
        </Card>
    );
}