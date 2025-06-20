"use server";

import { db } from "@/lib/db";
import { matches, matchPlayers, matchSets } from "@/lib/schema";
import { createMatchResultType, createMatchResultSchema } from "@/lib/zodSchemas";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function saveMatchResult(values: createMatchResultType) {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Not authenticated" };
  }

  const parsedValues = createMatchResultSchema.safeParse(values);

  if (!parsedValues.success) {
    return { error: "Invalid values" };
  }

  const { reservationId, matchType, players, sets } = parsedValues.data;

  try {
    const [newMatch] = await db
      .insert(matches)
      .values({
        reservationId,
        matchType,
      })
      .returning();

    await db.insert(matchPlayers).values(
      players.map((player) => ({
        matchId: newMatch.id,
        profileId: player.profileId,
        team: player.team,
      }))
    );

    await db.insert(matchSets).values(
      sets.map((set) => ({
        matchId: newMatch.id,
        setNumber: set.setNumber,
        team1Score: set.team1Score,
        team2Score: set.team2Score,
        team1TiebreakScore: set.team1TiebreakScore,
        team2TiebreakScore: set.team2TiebreakScore,
      }))
    );
  } catch (error) {
    return {
      error: "Failed to save match result",
    };
  }

  revalidatePath("/reservations");
  return { success: true };
} 