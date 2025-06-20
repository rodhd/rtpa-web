import { getClubCourts } from "@/app/actions";
import { getClubReservationsForPeriod } from "@/app/actions/reservations";
import { db } from "@/lib/db";
import { clubs, Reservation } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CourtCard } from "@/components/club/CourtCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  const allCourts = await getClubCourts(club.id);
  const courts = allCourts.filter(court => court.active);
  const tennisCourts = courts.filter(court => court.type === 'tennis');
  const paddelCourts = courts.filter(court => court.type === 'paddel');

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 3);
  endDate.setHours(0, 0, 0, 0);

  const reservations = await getClubReservationsForPeriod(
    club.id,
    startDate,
    endDate
  );

  const reservationsByCourt = reservations.reduce((acc, reservation) => {
    const courtId = reservation.courtId;
    if (!acc[courtId]) {
      acc[courtId] = [];
    }
    acc[courtId].push(reservation);
    return acc;
  }, {} as Record<number, Reservation[]>);

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Club Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold">{club.name}</h1>
            <Link href={`/clubs/${clubId}/leaderboard`}>
              <Button>View Leaderboard</Button>
            </Link>
          </div>
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
            <CourtCard
              key={court.id}
              court={court}
              reservations={reservationsByCourt[court.id] || []}
            />
          ))}
        </div>
      </section>

      {/* Paddel Courts Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Paddel Courts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paddelCourts.map((court) => (
            <CourtCard
              key={court.id}
              court={court}
              reservations={reservationsByCourt[court.id] || []}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
