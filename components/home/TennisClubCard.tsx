import Image from 'next/image';
import { Club } from "@/lib/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface TennisClubCardProps {
    club: Club;
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
            <CardFooter>
                <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                    5
                </Badge>
            </CardFooter>
        </Card>
    );
}