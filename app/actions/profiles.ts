"use server";

import { db } from "@/lib/db";
import { profiles, profilesToClubs, profileClubRoleSchema } from "@/lib/schema";
import { currentUser } from '@clerk/nextjs/server';
import { eq, notInArray, and } from "drizzle-orm";
import { profileFormSchemaType } from "@/lib/zodSchemas";
import { z } from "zod";
import { ProfileWithClubs } from "@/lib/types";

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