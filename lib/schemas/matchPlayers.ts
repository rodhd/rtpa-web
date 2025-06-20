import { pgTable, serial, integer, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";

export const matchPlayers = pgTable('match_players', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id').notNull(),
  profileId: varchar('profile_id').notNull(),
  team: integer('team').notNull(), // 1 or 2
});

export const selectMatchPlayersSchema = createSelectSchema(matchPlayers);
export type MatchPlayer = typeof matchPlayers.$inferSelect;
export const insertMatchPlayersSchema = createInsertSchema(matchPlayers);
export type NewMatchPlayer = typeof matchPlayers.$inferInsert; 