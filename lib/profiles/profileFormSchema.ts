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