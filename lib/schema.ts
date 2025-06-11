import { relations } from "drizzle-orm";
import { pgTable, point, serial, text, varchar, uuid, integer, primaryKey, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const profileClubRoleEnum = pgEnum('profileClubRole', ['member', 'manager']);
export const profileClubRoleSchema = z.enum(profileClubRoleEnum.enumValues); 

export const profiles = pgTable('profiles', {
  id: varchar('id').notNull().unique(),
  firstName: varchar('first_name', { length: 256 }),
  lastName: varchar('last_name', { length: 256 })
});

export const selectProfilesSchema = createSelectSchema(profiles);
export type Profile = typeof profiles.$inferSelect;
export const insertProfilesSchema = createInsertSchema(profiles);
export type ProfileUpdate = typeof profiles.$inferInsert;

export const profilesRelations = relations(profiles, ({ many }) => ({
  profilesToClubs: many(profilesToClubs)
}));

export const clubs = pgTable('clubs', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  // location: point('location'),
  website: varchar('website', { length: 256 }), 
  imageUrl: varchar('image_url', { length: 256 }),
});

export const selectClubsSchema = createSelectSchema(clubs);
export type Club = typeof clubs.$inferSelect

export const clubssRelations = relations(clubs, ({ many }) => ({
  profilesToClubs: many(profilesToClubs),
  courts: many(courts)
}));

export const profilesToClubs = pgTable('profiles_clubs', {
  profileId: varchar('profiles_id').references(() => profiles.id).notNull(),
  clubId: integer('club_id').references(() => clubs.id).notNull(),
  role: profileClubRoleEnum('role').notNull()
},
(t) => ({
  pk: primaryKey({ columns: [t.profileId, t.clubId] }),
}),);

export const selectProfileToClubsSchema = createSelectSchema(profilesToClubs);
export type ProfileToClub = typeof profilesToClubs.$inferSelect;
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

export const courtTypeEnum = pgEnum('courtType', ['tennis', 'paddel']);
export const courtTypeSchema = z.enum(courtTypeEnum.enumValues); 

export const courtSurfaceEnum = pgEnum('courtSurface', ['hard', 'clay', 'grass', 'carpet']);
export const courtSurfaceSchema = z.enum(courtSurfaceEnum.enumValues); 

export const courtLocationEnum = pgEnum('courtLocation', ['outdoor', 'indoor']);
export const courtLocationSchema = z.enum(courtSurfaceEnum.enumValues);

export const courts = pgTable('courts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: courtTypeEnum('type').notNull(),
  surface: courtSurfaceEnum('surface').notNull(),
  location: courtLocationEnum('location').notNull(),
  clubId: integer('club_id').references(() => clubs.id).notNull()
});

export const courtsRelations = relations(courts, ({ one }) => ({
  club: one(clubs, {
    fields: [courts.clubId],
    references: [clubs.id]
  })
}));

export const selectCourtsSchema = createSelectSchema(courts);
export type Court = typeof courts.$inferSelect;
export const insertCourtsSchema = createInsertSchema(courts);
export type CourtUpdate = typeof courts.$inferInsert;

export const reservations = pgTable('reservations', {
  id: serial('id').primaryKey(),
  courtId: integer('court_id').references(() => courts.id).notNull(),
  profileId: varchar('profile_id').references(() => profiles.id).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const selectReservationsSchema = createSelectSchema(reservations);
export type Reservation = typeof reservations.$inferSelect;
export const insertReservationsSchema = createInsertSchema(reservations);
export type ReservationUpdate = typeof reservations.$inferInsert;

export const reservationsRelations = relations(reservations, ({ one }) => ({
  court: one(courts, {
    fields: [reservations.courtId],
    references: [courts.id]
  }),
  profile: one(profiles, {
    fields: [reservations.profileId],
    references: [profiles.id]
  })
}));