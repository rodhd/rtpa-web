import { pgTable, serial, integer, pgEnum } from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const matchTypeEnum = pgEnum('matchType', ['singles', 'doubles']);
export const matchTypeSchema = z.enum(matchTypeEnum.enumValues);

export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  reservationId: integer('reservation_id').notNull(),
  matchType: matchTypeEnum('match_type').notNull(),
});

export const selectMatchesSchema = createSelectSchema(matches);
export type Match = typeof matches.$inferSelect;
export const insertMatchesSchema = createInsertSchema(matches);
export type NewMatch = typeof matches.$inferInsert; 