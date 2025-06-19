import { z } from "zod";

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