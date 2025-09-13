"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { SentIcon } from "@hugeicons/core-free-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Comment, TComment } from "@/validators/comment";
import { Doc } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { ConvexError } from "convex/values";

interface AddCommentFormProps {
   spotId: Doc<"spots">["_id"];
}

export default function AddCommentForm({ spotId }: AddCommentFormProps) {
   const addNewComment = useMutation(api.spots.addComment);
   const {
      register,
      reset,
      handleSubmit,
      formState: { errors },
   } = useForm<TComment>({
      resolver: zodResolver(Comment),
   });

   async function onsubmit(data: TComment) {
      try {
         const res = await addNewComment({
            text: data.text,
            spotId,
         });

         if (res.error) {
            toast.error(res.message);
            return;
         }

         reset();
      } catch (error) {
         toast.error(
            error instanceof ConvexError
               ? error.message
               : "Something went wrong!"
         );
      }
   }

   return (
      <form
         onSubmit={handleSubmit(onsubmit)}
         className="p-3 border-t flex gap-2 items-center"
      >
         <Input
            {...register("text")}
            placeholder="Write a comment..."
            className="flex-1"
            aria-invalid={!!errors.text}
         />
         <Button>
            <HugeiconsIcon icon={SentIcon} />
         </Button>
      </form>
   );
}
