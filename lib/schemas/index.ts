export * from './profiles';
export * from './clubs';
export * from './profilesToClubs';
export * from './courts';
export * from './reservations';

import { relations } from 'drizzle-orm';
import { profiles } from './profiles';
import { clubs } from './clubs';
import { profilesToClubs } from './profilesToClubs';
import { courts } from './courts';
import { reservations } from './reservations';

export const profilesRelations = relations(profiles, ({ many }) => ({
  profilesToClubs: many(profilesToClubs)
}));

export const clubsRelations = relations(clubs, ({ many }) => ({
  profilesToClubs: many(profilesToClubs),
  courts: many(courts)
}));

export const profilesToClubsRelations = relations(profilesToClubs, ({ one }) => ({
  profile: one(profiles, {
    fields: [profilesToClubs.profileId],
    references: [profiles.id]
  }),
  club: one(clubs, {
    fields: [profilesToClubs.clubId],
    references: [clubs.id]
  })
}));

export const courtsRelations = relations(courts, ({ one }) => ({
  club: one(clubs, {
    fields: [courts.clubId],
    references: [clubs.id]
  })
}));

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