import { pgTable, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const profiles = pgTable('profiles', {
  id: varchar('id').notNull().unique(),
  firstName: varchar('first_name', { length: 256 }),
  lastName: varchar('last_name', { length: 256 })
});

export const selectProfilesSchema = createSelectSchema(profiles);
export type Profile = typeof profiles.$inferSelect;
export const insertProfilesSchema = createInsertSchema(profiles);
export type ProfileUpdate = typeof profiles.$inferInsert;

// Relations will be imported and defined in the main index or where needed 