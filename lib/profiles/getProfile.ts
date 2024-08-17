"use server"

import { createClient } from "@/utils/supabase/server";
import { profiles } from "../schema";
import { db } from "../db";
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
    where: eq(profiles.id, user.id)
  });

  return profile;
}