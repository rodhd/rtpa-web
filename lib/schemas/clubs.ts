import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";

export const clubs = pgTable('clubs', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  // location: point('location'),
  website: varchar('website', { length: 256 }),
  imageUrl: varchar('image_url', { length: 256 }),
});

export const selectClubsSchema = createSelectSchema(clubs);
export type Club = typeof clubs.$inferSelect;

// Relations will be imported and defined in the main index or where needed 