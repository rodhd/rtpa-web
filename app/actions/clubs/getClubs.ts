"use server"

import { createClient } from "@/utils/supabase/server";
import { Club, profiles } from "../../../lib/schema";
import { db } from "../../../lib/db";
import { eq } from "drizzle-orm/sql";

export async function getClubs(): Promise<Club[]|null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if(!user) {
    return null;
  }
  
  const clubs = await db.query.clubs.findMany();

  return clubs;
}