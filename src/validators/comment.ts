import { z } from "zod";

export const Comment = z.object({
   text: z.string().min(2),
});

export type TComment = z.infer<typeof Comment>;
