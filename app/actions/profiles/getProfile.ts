"use server"

import { createClient } from "@/lib/supabase/server";
import { profiles } from "../../../lib/schema";
import { db } from "../../../lib/db";
import { eq } from "drizzle-orm/sql";

export async function getProfile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if(!user) {
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