import { z } from "zod";
import { courtLocationEnum, courtSurfaceEnum, courtTypeEnum } from "./schema";
import { createInsertSchema } from "drizzle-zod";
import { reservations } from "./schema";

export const profileFormSchema = z.object({
    firstName: z.string().min(3, {
        message: "First name must be longer than 3 characters."
    }),
    lastName: z.string().min(3, {
        message: "Last name must be longer than 3 characters."
    }),
    clubIds: z.array(z.number().int())
});

export type profileFormSchemaType = z.infer<typeof profileFormSchema>;

export const createCourtSchema = z.object({
    name: z.string().min(3, "Court name must be at least 3 characters long"),
    type: z.enum(["tennis", "paddel"]),
    surface: z.enum(["hard", "clay", "grass", "carpet"]),
    location: z.enum(["outdoor", "indoor"]),
});

export type createCourtSchemaType = z.infer<typeof createCourtSchema>;

export const insertReservationsSchema = createInsertSchema(reservations);
export type ReservationUpdate = typeof reservations.$inferInsert;

export const insertMatchPlayerSchema = z.object({
  profileId: z.string(),
  team: z.number().min(1).max(2),
});

export const insertMatchSetSchema = z.object({
  setNumber: z.coerce.number().min(1),
  team1Score: z.coerce.number().min(0).max(7),
  team2Score: z.coerce.number().min(0).max(7),
  team1TiebreakScore: z.coerce.number().max(10).optional(),
  team2TiebreakScore: z.coerce.number().max(10).optional(),
});

export const createMatchResultSchema = z.object({
  reservationId: z.number(),
  matchType: z.enum(["singles", "doubles"]),
  players: z.array(insertMatchPlayerSchema).min(2).max(4),
  sets: z.array(insertMatchSetSchema).min(1).max(5),
});

export type createMatchResultType = z.infer<typeof createMatchResultSchema>;