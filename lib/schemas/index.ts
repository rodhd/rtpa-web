export * from './profiles';
export * from './clubs';
export * from './profilesToClubs';
export * from './courts';
export * from './reservations';
export * from './matches';
export * from './matchPlayers';
export * from './matchSets';

import { relations } from 'drizzle-orm';
import { profiles } from './profiles';
import { clubs } from './clubs';
import { profilesToClubs } from './profilesToClubs';
import { courts } from './courts';
import { reservations } from './reservations';
import { matches } from './matches';
import { matchPlayers } from './matchPlayers';
import { matchSets } from './matchSets';

export const profilesRelations = relations(profiles, ({ many }) => ({
  profilesToClubs: many(profilesToClubs),
  matchPlayers: many(matchPlayers),
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
  }),
  match: one(matches, {
    fields: [reservations.id],
    references: [matches.reservationId]
  })
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  reservation: one(reservations, {
    fields: [matches.reservationId],
    references: [reservations.id]
  }),
  matchPlayers: many(matchPlayers),
  matchSets: many(matchSets)
}));

export const matchPlayersRelations = relations(matchPlayers, ({ one }) => ({
  match: one(matches, {
    fields: [matchPlayers.matchId],
    references: [matches.id]
  }),
  profile: one(profiles, {
    fields: [matchPlayers.profileId],
    references: [profiles.id]
  })
}));

export const matchSetsRelations = relations(matchSets, ({ one }) => ({
  match: one(matches, {
    fields: [matchSets.matchId],
    references: [matches.id]
  })
})); 