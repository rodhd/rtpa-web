import { getUserReservations } from "@/app/actions/reservations";
import { ReservationCard } from "@/components/reservation/ReservationCard";
import { Reservation, Court, Club, Match, MatchPlayer, MatchSet, Profile } from "@/lib/schema";

export default async function ReservationsPage() {
  const reservations = (await getUserReservations()) as (Reservation & {
    court: Court & { club: Club };
    match:
      | (Match & {
          matchPlayers: (MatchPlayer & {
            profile: Profile | null;
          })[];
          matchSets: MatchSet[];
        })
      | null;
  })[];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Reservations</h1>
      {reservations.length === 0 ? (
        <p>You have no reservations.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reservations.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))}
        </div>
      )}
    </div>
  );
} 