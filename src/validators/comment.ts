import { z } from "zod";

export const Comment = z.object({
   text: z.string(),
});

export type TComment = z.infer<typeof Comment>;
