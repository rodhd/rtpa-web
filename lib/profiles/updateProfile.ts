"use server"

import { createClient } from "@/utils/supabase/server";
import { profileClubRoleEnum, profileClubRoleSchema, profiles, profilesToClubs } from "../schema";
import { db } from "../db";
import { and, eq, notInArray } from "drizzle-orm/sql";
import { profileFormSchemaType } from "./profileFormSchema";
import { getProfile } from "./getProfile";



export async function updateProfile(updateProfileFormData: profileFormSchemaType) {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

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