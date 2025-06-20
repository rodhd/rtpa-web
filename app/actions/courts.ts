"use server";

import { db } from "@/lib/db";
import { courts } from "@/lib/schema";
import { createCourtSchema, createCourtSchemaType } from "@/lib/zodSchemas";
import { and, asc, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createCourt(
    clubId: string,
    values: unknown
) {
    const parsedValues = createCourtSchema.safeParse(values);
    if (!parsedValues.success) {
        return {
            error: "Invalid values",
        };
    }

    try {
        await db.insert(courts).values({
            ...parsedValues.data,
            clubId: Number(clubId),
        });

        revalidatePath(`/clubs/${clubId}/manage`);

        return {
            success: true,
        }
    } catch (error) {
        return {
            error: "Failed to create court",
        };
    }
}

export async function getClubCourts(clubId: number) {
    const clubCourts = await db.query.courts.findMany({
        where: eq(courts.clubId, clubId),
    });
    return clubCourts;
}

export async function getCourtCountsByClub(clubId?: number): Promise<Record<number, Record<string, number>>> {
    const query = db.select({
        clubId: courts.clubId,
        type: courts.type,
        count: count()
    }).from(courts);

    if (clubId) {
        (query as any).where(eq(courts.clubId, clubId));
    }

    const courtsByClub = await query.groupBy(courts.clubId, courts.type);
    
    const counts: Record<number, Record<string, number>> = {};
    courtsByClub.forEach(court => {
        if (!counts[court.clubId]) {
            counts[court.clubId] = {};
        }
        counts[court.clubId][court.type] = court.count;
    });
    return counts;
}

export async function toggleCourtStatus(courtId: number, newStatus: boolean, clubId: number) {
  await db.update(courts).set({ active: newStatus }).where(eq(courts.id, courtId));
  revalidatePath(`/clubs/${clubId}/manage`);
}

export async function updateCourt(courtId: number, clubId: string, values: createCourtSchemaType) {
  const parsedValues = createCourtSchema.safeParse(values);

  if (!parsedValues.success) {
    return {
      error: "Invalid input",
    }
  }

  try {
    await db.update(courts).set(parsedValues.data).where(eq(courts.id, courtId));

    revalidatePath(`/clubs/${clubId}/manage`);
    revalidatePath(`/clubs/${clubId}/courts/${courtId}`);

    return {
      success: true,
    }
  } catch (error) {
    return {
      error: "Could not update court",
    }
  }
} 