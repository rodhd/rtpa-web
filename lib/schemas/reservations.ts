import { pgTable, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";

export const reservations = pgTable('reservations', {
  id: serial('id').primaryKey(),
  courtId: integer('court_id').notNull(),
  profileId: varchar('profile_id').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const selectReservationsSchema = createSelectSchema(reservations);
export type Reservation = typeof reservations.$inferSelect;
export const insertReservationsSchema = createInsertSchema(reservations);
export type ReservationUpdate = typeof reservations.$inferInsert;

// Relations will be imported and defined in the main index or where needed 