"use server";

import { db } from "@/lib/db";
import { Club, clubs, profilesToClubs, profileClubRoleSchema } from "@/lib/schema";
import { currentUser } from '@clerk/nextjs/server';
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { getCourtCountsByClub } from "./courts";

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