import { relations } from "drizzle-orm";
import { pgTable, point, serial, text, varchar, uuid, integer, primaryKey, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const profileClubRoleEnum = pgEnum('profileClubRole', ['member', 'manager']);
export const profileClubRoleSchema = z.enum(profileClubRoleEnum.enumValues); 

export const profiles = pgTable('profiles', {
  id: uuid('id').notNull().unique(),
  firstName: varchar('first_name', { length: 256 }),
  lastName: varchar('last_name', { length: 256 })
});

export const selectProfilesSchema = createSelectSchema(profiles);
export type Profile = typeof profiles.$inferSelect
export const insertProfilesSchema = createInsertSchema(profiles);
export type ProfileUpdate = typeof profiles.$inferInsert

export const profilesRelations = relations(profiles, ({ many }) => ({
  profilesToClubs: many(profilesToClubs)
}));

export const clubs = pgTable('clubs', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  // location: point('location'),
  website: varchar('website', { length: 256 })
});

export const selectClubsSchema = createSelectSchema(clubs);
export type Club = typeof clubs.$inferSelect

export const clubssRelations = relations(clubs, ({ many }) => ({
  profilesToClubs: many(profilesToClubs)
}));

export const profilesToClubs = pgTable('profiles_clubs', {
  profileId: uuid('profiles_id').references(() => profiles.id).notNull(),
  clubId: integer('club_id').references(() => clubs.id).notNull(),
  role: profileClubRoleEnum('role').notNull()
},
(t) => ({
  pk: primaryKey({ columns: [t.profileId, t.clubId] }),
}),);

export const insertProfilesToClubsSchema = createInsertSchema(profilesToClubs);

export const profilesToClubsRelations = relations(profilesToClubs, ({ one }) => ({
  profile: one(profiles, {
    fields: [profilesToClubs.profileId],
    references: [profiles.id]
  }),
  club: one(clubs, {
    fields: [profilesToClubs.clubId],
    references: [clubs.id]
  })
}))