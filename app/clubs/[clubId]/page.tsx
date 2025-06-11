import { getClubCourts } from "@/app/actions";
import { db } from "@/lib/db";
import { clubs } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CourtCard } from "@/components/club/CourtCard";

interface ClubPageProps {
  params: {
    clubId: string;
  };
}

export default async function ClubPage({ params }: ClubPageProps) {
  const { clubId } = await params;
  const club = await db.query.clubs.findFirst({
    where: eq(clubs.id, parseInt(clubId)),
  });

  if (!club) {
    notFound();
  }

  const courts = await getClubCourts(club.id.toString());
  const tennisCourts = courts.filter(court => court.type === 'tennis');
  const paddelCourts = courts.filter(court => court.type === 'paddel');

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Club Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{club.name}</h1>
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground">{club.address}</p>
            {club.website && (
              <a 
                href={club.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Visit Website
              </a>
            )}
          </div>
        </div>
        {club.imageUrl && (
          <div className="relative aspect-video">
            <Image
              src={club.imageUrl}
              alt={`${club.name} map`}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Tennis Courts Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Tennis Courts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tennisCourts.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>
      </section>

      {/* Paddel Courts Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Paddel Courts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paddelCourts.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>
      </section>
    </div>
  );
}
