"use server"

import { db } from "@/lib/db";
import { Club, profileClubRoleEnum, profileClubRoleSchema, profiles, profilesToClubs, clubs, courts, Court, Profile, ProfileToClub, reservations } from "@/lib/schema";
import { auth, currentUser } from '@clerk/nextjs/server';
import { and, asc, eq, notInArray, count, or, lte, gt, lt, gte, isNull } from "drizzle-orm";
import { profileFormSchemaType } from "../lib/zodSchemas";
import { z } from "zod";

type ProfileWithClubs = Profile & {
    profilesToClubs: ProfileToClub[]
};


export async function getClubs(): Promise<(Club & { courtCounts: Record<string, number> })[] | null> {
    const user = await currentUser()

    if (!user) {
        return null;
    }

    const clubs = await db.query.clubs.findMany();
    const courtCounts = await getCourtCountsByClub();

    return clubs.map(club => ({
        ...club,
        courtCounts: courtCounts[club.id] || {}
    }));
}

export async function getClub(id: string): Promise<Club | null> {
    const user = await currentUser()

    const isNumber = z.coerce.number();
    const idNumeric = isNumber.safeParse(id);

    console.log(idNumeric)

    if (!user || !idNumeric.success) {
        return null;
    }

    const club = await db.query.clubs.findFirst({
        where: eq(clubs.id, idNumeric.data)
    });

    if (!club) {
        return null;
    }

    return club;
}

export async function getProfile(): Promise<ProfileWithClubs | undefined> {
    const user = await currentUser()

    if (!user) {
        return;
    }

    let profile;
    profile = await db.query.profiles.findFirst({
        with: {
            profilesToClubs: true
        },
        where: eq(profiles.id, user.id)
    });

    if (!profile) {
        await db.insert(profiles)
            .values({ id: user.id, firstName: user.firstName, lastName: user.lastName });

        profile = await db.query.profiles.findFirst({
            with: {
                profilesToClubs: true
            },
            where: eq(profiles.id, user.id)
        });
    }

    return profile as ProfileWithClubs;
}

export async function updateProfile(updateProfileFormData: profileFormSchemaType) {
    const user = await currentUser()

    if (!user) {
        return;
    }

    await db.update(profiles)
        .set({ firstName: updateProfileFormData.firstName, lastName: updateProfileFormData.lastName })
        .where(eq(profiles.id, user.id));

    const clubIdsValues = updateProfileFormData.clubIds.map((c) => ({ profileId: user.id, clubId: c, role: profileClubRoleSchema.Enum.member }));

    await db.delete(profilesToClubs)
        .where(and(eq(profilesToClubs.profileId, user.id), notInArray(profilesToClubs.clubId, updateProfileFormData.clubIds)));

    await db.insert(profilesToClubs)
        .values(clubIdsValues)
        .onConflictDoNothing();

    const profile = await db.query.profiles.findFirst({
        with: {
            profilesToClubs: true
        },
        where: eq(profiles.id, user.id)
    });

    return profile;
}

export async function isProfileClubManager(clubId: string): Promise<boolean> {
    const user = await currentUser()

    if (!user) {
        return false;
    }

    const isClubManager = await db.query.profilesToClubs.findFirst({
        where: and(eq(profilesToClubs.profileId, user.id), eq(profilesToClubs.clubId, Number(clubId)), eq(profilesToClubs.role, profileClubRoleSchema.enum.manager))
    });

    if (!isClubManager) {
        return false;
    }

    return true;

}

export async function IsManager(): Promise<number | undefined> {
    const user = await currentUser()

    if (!user) {
        return;
    }

    const { clubId } = await db.query.profilesToClubs.findFirst({
        where: and(eq(profilesToClubs.profileId, user.id), eq(profilesToClubs.role, profileClubRoleSchema.enum.manager))
    }) || {};

    if (!clubId) {
        return;
    }

    return clubId;
}

export async function getClubCourts(clubId: string): Promise<Court[]> {
    const clubCourts = await db.query.courts.findMany({
        where: and(eq(courts.clubId, Number(clubId))),
        orderBy: [asc(courts.name)]
    });

    return clubCourts;
}

export async function getCourtCountsByClub(): Promise<Record<number, Record<string, number>>> {
    const courtsByClub = await db.select({
        clubId: courts.clubId,
        type: courts.type,
        count: count()
    }).from(courts).groupBy(courts.clubId, courts.type);

    const counts: Record<number, Record<string, number>> = {};

    courtsByClub.forEach(court => {
        if (!counts[court.clubId]) {
            counts[court.clubId] = {};
        }
        counts[court.clubId][court.type] = court.count;
    });

    return counts;
}

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