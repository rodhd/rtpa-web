import { pgTable, varchar, integer, primaryKey, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profileClubRoleEnum = pgEnum('profileClubRole', ['member', 'manager']);
export const profileClubRoleSchema = z.enum(profileClubRoleEnum.enumValues);

export const profilesToClubs = pgTable('profiles_clubs', {
  profileId: varchar('profiles_id').notNull(),
  clubId: integer('club_id').notNull(),
  role: profileClubRoleEnum('role').notNull()
},
(t) => ({
  pk: primaryKey({ columns: [t.profileId, t.clubId] }),
}),);

export const selectProfileToClubsSchema = createSelectSchema(profilesToClubs);
export type ProfileToClub = typeof profilesToClubs.$inferSelect;
export const insertProfilesToClubsSchema = createInsertSchema(profilesToClubs);

// Relations will be imported and defined in the main index or where needed 