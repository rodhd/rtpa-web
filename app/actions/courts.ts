"use server";

import { db } from "@/lib/db";
import { courts } from "@/lib/schema";
import { and, asc, count, eq } from "drizzle-orm";

export async function getClubCourts(clubId: string) {
    const clubCourts = await db.query.courts.findMany({
        where: and(eq(courts.clubId, Number(clubId))),
        orderBy: [asc(courts.name)]
    });
    return clubCourts;
}

export async function getCourtCountsByClub(): Promise<Record<number, Record<string, number>>> {
    const courtsByClub = await db.select({
        clubId: courts.clubId,
        type: courts.type,
        count: count()
    }).from(courts).groupBy(courts.clubId, courts.type);
    const counts: Record<number, Record<string, number>> = {};
    courtsByClub.forEach(court => {
        if (!counts[court.clubId]) {
            counts[court.clubId] = {};
        }
        counts[court.clubId][court.type] = court.count;
    });
    return counts;
} 