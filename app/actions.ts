"use server"

import { db } from "@/lib/db";
import { Club, profileClubRoleSchema, profiles, profilesToClubs } from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";
import { and, eq, notInArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { profileFormSchemaType } from "../lib/zodSchemas";

export async function getClubs(): Promise<Club[] | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const clubs = await db.query.clubs.findMany();

  return clubs;
}
export async function getProfile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const profile = await db.query.profiles.findFirst({
    with: {
      profilesToClubs: true
    },
    where: eq(profiles.id, user.id)
  });

  return profile;
}
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

