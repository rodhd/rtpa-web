"use server"

import { db } from "@/lib/db";
import { Club, profileClubRoleEnum, profileClubRoleSchema, profiles, profilesToClubs, clubs, courts, Court, Profile, ProfileToClub } from "@/lib/schema";
import { auth, currentUser } from '@clerk/nextjs/server'
import { and, asc, eq, notInArray } from "drizzle-orm";
import { profileFormSchemaType } from "../lib/zodSchemas";
import { z } from "zod";

type ProfileWithClubs = Profile & {
    profilesToClubs: ProfileToClub[]
};


export async function getClubs(): Promise<Club[] | null> {
    const user = await currentUser()

    if (!user) {
        return null;
    }

    const clubs = await db.query.clubs.findMany();

    return clubs;
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

export async function getOrCreateProfile(): Promise<ProfileWithClubs | undefined> {
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

    return profile;
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