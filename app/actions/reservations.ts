"use server";

import { db } from "@/lib/db";
import { reservations, profiles, courts } from "@/lib/schema";
import { auth } from '@clerk/nextjs/server';
import { and, or, lte, gt, lt, gte, isNull, eq, inArray } from "drizzle-orm";

export async function createReservation(data: {
  courtId: number;
  startDate: Date;
  endDate: Date;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, userId),
  });
  if (!profile) {
    throw new Error("Profile not found");
  }
  // Check for overlapping reservations
  const overlappingReservations = await db.query.reservations.findMany({
    where: and(
      eq(reservations.courtId, data.courtId),
      isNull(reservations.deletedAt),
      or(
        and(
          lte(reservations.startDate, data.startDate),
          gt(reservations.endDate, data.startDate)
        ),
        and(
          lt(reservations.startDate, data.endDate),
          gte(reservations.endDate, data.endDate)
        ),
        and(
          gte(reservations.startDate, data.startDate),
          lte(reservations.endDate, data.endDate)
        )
      )
    ),
  });
  if (overlappingReservations.length > 0) {
    throw new Error("This time slot overlaps with an existing reservation");
  }
  const reservation = await db.insert(reservations).values({
    courtId: data.courtId,
    profileId: userId,
    startDate: data.startDate,
    endDate: data.endDate,
  }).returning();
  return reservation[0];
}

export async function getCourtReservations(courtId: number, startDate: Date, endDate: Date) {
  const existingReservations = await db.query.reservations.findMany({
    where: and(
      eq(reservations.courtId, courtId),
      isNull(reservations.deletedAt),
      // Check if the reservation overlaps with the given date range
      or(
        and(
          lte(reservations.startDate, startDate),
          gt(reservations.endDate, startDate)
        ),
        and(
          lt(reservations.startDate, endDate),
          gte(reservations.endDate, endDate)
        ),
        and(
          gte(reservations.startDate, startDate),
          lte(reservations.endDate, endDate)
        )
      )
    ),
  });
  return existingReservations;
}

export async function getClubReservationsForPeriod(
  clubId: number,
  startDate: Date,
  endDate: Date
) {
  const activeCourts = await db.query.courts.findMany({
    where: and(eq(courts.clubId, clubId), eq(courts.active, true)),
  });

  if (activeCourts.length === 0) {
    return [];
  }

  const courtIds = activeCourts.map((court) => court.id);

  const clubReservations = await db.query.reservations.findMany({
    where: and(
      inArray(reservations.courtId, courtIds),
      isNull(reservations.deletedAt),
      gte(reservations.startDate, startDate),
      lte(reservations.endDate, endDate)
    ),
  });

  return clubReservations;
} 