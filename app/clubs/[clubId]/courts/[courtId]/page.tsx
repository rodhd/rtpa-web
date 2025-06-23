import { ReservationSlots } from "@/components/court/ReservationSlots";
import { db } from "@/lib/db";
import { courts } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from '@clerk/nextjs/server';

export default async function CourtPage({ params }: { params: Promise<{ clubId: string, courtId: string }> }) {
  const { userId } = await auth();
  const { clubId, courtId } = await params;

  if (!userId) {
    return redirect("/");
  }

  const court = await db.query.courts.findFirst({
    where: eq(courts.id, parseInt(courtId)),
  });

  if (!court || !court.active) {
    return redirect(`/clubs/${clubId}`);
  }

  return (
    <div className="flex w-full flex-col gap-10 items-center">
      <h1 className="text-3xl">{court.name}</h1>
      <h2 className="text-2xl">Make a Reservation</h2>
      <div className="w-full max-w-6xl">
        <ReservationSlots court={court} />
      </div>
    </div>
  );
}