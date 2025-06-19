import { pgTable, serial, text, integer, pgEnum, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const courtTypeEnum = pgEnum('courtType', ['tennis', 'paddel']);
export const courtTypeSchema = z.enum(courtTypeEnum.enumValues);

export const courtSurfaceEnum = pgEnum('courtSurface', ['hard', 'clay', 'grass', 'carpet']);
export const courtSurfaceSchema = z.enum(courtSurfaceEnum.enumValues);

export const courtLocationEnum = pgEnum('courtLocation', ['outdoor', 'indoor']);
export const courtLocationSchema = z.enum(courtLocationEnum.enumValues);

export const courts = pgTable('courts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: courtTypeEnum('type').notNull(),
  surface: courtSurfaceEnum('surface').notNull(),
  location: courtLocationEnum('location').notNull(),
  clubId: integer('club_id').notNull(),
  active: boolean("active").default(true).notNull(),
});

export const selectCourtsSchema = createSelectSchema(courts);
export type Court = typeof courts.$inferSelect;
export const insertCourtsSchema = createInsertSchema(courts);
export type NewCourt = typeof courts.$inferInsert;

// Relations will be imported and defined in the main index or where needed 