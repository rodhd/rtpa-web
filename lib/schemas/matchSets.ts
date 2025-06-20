import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";

export const matchSets = pgTable('match_sets', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id').notNull(),
  setNumber: integer('set_number').notNull(),
  team1Score: integer('team1_score').notNull(),
  team2Score: integer('team2_score').notNull(),
  team1TiebreakScore: integer('team1_tiebreak_score'),
  team2TiebreakScore: integer('team2_tiebreak_score'),
});

export const selectMatchSetsSchema = createSelectSchema(matchSets);
export type MatchSet = typeof matchSets.$inferSelect;
export const insertMatchSetsSchema = createInsertSchema(matchSets);
export type NewMatchSet = typeof matchSets.$inferInsert; 