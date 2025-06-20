"use server";

import { db } from "@/lib/db";
import { Club, clubs, profilesToClubs, profileClubRoleSchema, reservations, courts, matches, Profile } from "@/lib/schema";
import { currentUser } from '@clerk/nextjs/server';
import { eq, and, inArray, not, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { getCourtCountsByClub } from "./courts";
import { revalidatePath } from "next/cache";

export interface LeaderboardEntry {
    profileId: string;
    firstName: string;
    lastName: string;
    matchesPlayed: number;
    matchesWon: number;
    setsWon: number;
    gamesWon: number;
    score: number;
}

export async function getClubs(): Promise<(Club & { courtCounts: Record<string, number> })[] | null> {
    const user = await currentUser()
    if (!user) {
        return null;
    }
    const clubs = await db.query.clubs.findMany();
    const courtCounts = await getCourtCountsByClub();
    return clubs.map(club => ({
        ...club,
        courtCounts: courtCounts[club.id] || {}
    }));
}

export async function getClub(id: string): Promise<Club | null> {
    const user = await currentUser()
    const isNumber = z.coerce.number();
    const idNumeric = isNumber.safeParse(id);
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

export async function getClubLeaderboardByClubId(clubId: number): Promise<LeaderboardEntry[]> {
    const club = await getClub(clubId.toString());
    if (!club) {
        return [];
    }

    let leaderboard = await db.execute(sql`WITH match_results AS (
        SELECT
        match_players.profile_id,
        match_sets.match_id,
        sum(case
            when match_players.team = 1 AND match_sets.team1_score > match_sets.team2_score then 1
            when match_players.team = 2 AND match_sets.team2_score > match_sets.team1_score then 1
            else 0
        end) sets_won,
        sum(case
            when match_players.team = 1 AND match_sets.team1_score < match_sets.team2_score then 1
            when match_players.team = 2 AND match_sets.team2_score < match_sets.team1_score then 1
            else 0
        end) rival_sets_won,
        sum(case
            when match_players.team = 1 AND match_sets.team1_score > match_sets.team2_score then team1_score
            when match_players.team = 2 AND match_sets.team2_score > match_sets.team1_score then team2_score
            else 0
        end) games_won,
        sum(case
            when match_players.team = 1 AND match_sets.team1_score < match_sets.team2_score then team2_score
            when match_players.team = 2 AND match_sets.team2_score < match_sets.team1_score then team1_score
            else 0
        end) rival_games_won
        FROM
        matches
            JOIN reservations ON matches.reservation_id = reservations.id
            JOIN courts ON reservations.court_id = courts.id
            JOIN clubs ON courts.club_id = clubs.id
            JOIN match_sets ON matches.id = match_sets.match_id
            JOIN match_players ON matches.id = match_players.match_id
        WHERE
        clubs.id = ${clubId}
        GROUP BY
            1,2)
        SELECT
        profile_id AS "profileId",
        profiles.first_name AS "firstName",
        profiles.last_name AS "lastName",
        count(distinct match_id) AS "matchesPlayed",
        sum(
            case
            when sets_won > rival_sets_won then 1
            else 0
        end) AS "matchesWon",
        sum(sets_won) AS "setsWon",
        sum(games_won) AS "gamesWon",
        sum(
            case
            when sets_won > rival_sets_won then 1
            else 0
        end) * 4 + sum(sets_won) * 2 + sum(games_won) as score
        FROM
        match_results
        JOIN profiles ON match_results.profile_id = profiles.id
        GROUP BY
        1,2,3
        ORDER BY
        score DESC`);

    return leaderboard.rows.map((row) => ({
        profileId: row.profileId as string,
        firstName: row.firstName as string,
        lastName: row.lastName as string,
        matchesPlayed: row.matchesPlayed as number,
        matchesWon: row.matchesWon as number,
        setsWon: row.setsWon as number,
        gamesWon: row.gamesWon as number,
        score: row.score as number,
    }));
}