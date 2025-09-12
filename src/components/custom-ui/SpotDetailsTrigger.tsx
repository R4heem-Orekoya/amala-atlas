"use client";

import { Button } from "@/components/ui/button";
import {
   Sheet,
   SheetContent,
   SheetFooter,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import { HugeiconsIcon } from "@hugeicons/react";
import {
   Delete02Icon,
   Bookmark02Icon,
   Share08Icon,
   Flag01Icon,
   ThumbsUpIcon,
   ThumbsDownIcon,
   Location01Icon,
   Comment01Icon,
   Image03Icon,
   CheckmarkBadge01Icon,
} from "@hugeicons/core-free-icons";
import { ShareSpotModal } from "./ShareSpotModal";
import { Doc } from "../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import AddCommentForm from "../add-comment-form";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "@clerk/nextjs";
import NumberFlow from "@number-flow/react";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

type SpotDetailsTriggerProps = {
   children: React.ReactNode;
   spot: Doc<"spots">;
};

export function SpotDetailsTrigger({
   children,
   spot,
}: SpotDetailsTriggerProps) {
   const { user } = useUser();

   const bookmarks = useQuery(api.spots.bookmarks, !user ? "skip" : undefined);

   const comments =
      useQuery(api.spots.comments, {
         spotId: spot._id,
         take: 20,
      }) ?? [];

   const upvotes =
      useQuery(api.spots.upvotes, {
         spotId: spot._id,
      }) ?? [];

   const downvotes =
      useQuery(api.spots.downvotes, {
         spotId: spot._id,
      }) ?? [];

   const images: { _id: string; url: string }[] =
      useQuery(api.spots.imagesBySpot, { spotId: spot._id }) ?? [];

   const [selectedImage, setSelectedImage] = useState<string | null>(null);
   const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>(
      {}
   );
   const [fullLoaded, setFullLoaded] = useState(false);

   const isVerified = upvotes.length - downvotes.length >= 5;

   const deleteCommentMutation = useMutation(api.spots.deleteComment);
   const upvoteMutation = useMutation(api.spots.upvote);
   const downvoteMutation = useMutation(api.spots.downvote);
   const bookmarkMutation = useMutation(api.spots.bookmark);

   function deleteComment(commentId: Doc<"comments">["_id"]) {
      void deleteCommentMutation({
         commentId,
      }).catch((error) => {
         toast.error(
            error instanceof ConvexError
               ? error.message
               : "Couldn't delete comment!"
         );
      });
   }

   async function upvote(spotId: Doc<"spots">["_id"]) {
      try {
         const res = await upvoteMutation({
            spotId,
         });

         if (res && res.error) {
            toast.error(res.message);
         }
      } catch (error) {
         toast.error(
            error instanceof ConvexError
               ? error.message
               : "Couldn't upvote spot!"
         );
      }
   }

   async function downvote(spotId: Doc<"spots">["_id"]) {
      try {
         const res = await downvoteMutation({
            spotId,
         });

         if (res && res.error) {
            toast.error(res.message);
         }
      } catch (error) {
         toast.error(
            error instanceof ConvexError
               ? error.message
               : "Couldn't downvote spot!"
         );
      }
   }

   async function addToBookmark(spotId: Doc<"spots">["_id"]) {
       try {
         const res = await bookmarkMutation({
            spotId,
         });

         if (res && res.error) {
            toast.error(res.message);
         }
      } catch (error) {
         toast.error(
            error instanceof ConvexError
               ? error.message
               : "Couldn't bookmark spot!"
         );
      }
   }

   return (
      <Sheet>
         <SheetTrigger asChild>{children}</SheetTrigger>
         <SheetContent
            side="right"
            className="w-full sm:max-w-md h-[100dvh] p-0 flex flex-col gap-0"
         >
            <SheetHeader className="p-4 border-b">
               <div className="h-52 w-full rounded-md overflow-hidden bg-muted relative mt-7">
                  {images.length > 0 ? (
                     <Carousel className="w-full h-full">
                        <CarouselContent>
                           {images.map((img) => (
                              <CarouselItem
                                 key={img._id}
                                 className="flex items-center justify-center"
                              >
                                 <div className="relative w-full h-52">
                                    {!loadedImages[img._id] && (
                                       <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
                                    )}
                                    <Image
                                       src={img.url}
                                       alt={spot.name}
                                       width={600}
                                       height={400}
                                       className={cn(
                                          "object-cover w-full h-52 cursor-pointer transition-opacity duration-300",
                                          loadedImages[img._id]
                                             ? "opacity-100"
                                             : "opacity-0"
                                       )}
                                       onClick={() => {
                                          setFullLoaded(false);
                                          setSelectedImage(img.url);
                                       }}
                                       onLoadingComplete={() =>
                                          setLoadedImages((prev) => ({
                                             ...prev,
                                             [img._id]: true,
                                          }))
                                       }
                                    />
                                 </div>
                              </CarouselItem>
                           ))}
                        </CarouselContent>
                        {images.length > 1 && (
                           <>
                              <CarouselPrevious />
                              <CarouselNext />
                           </>
                        )}
                     </Carousel>
                  ) : (
                     <div className="flex items-center justify-center h-full text-muted-foreground">
                        <HugeiconsIcon
                           icon={Image03Icon}
                           className="size-10 opacity-50"
                        />
                     </div>
                  )}
               </div>

               <div className="mt-3">
                  <SheetTitle className="text-xl font-semibold">
                     {spot.name ?? "Amala Spot"}
                     {isVerified && (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 ml-2">
                           <HugeiconsIcon
                              icon={CheckmarkBadge01Icon}
                              className="size-4 "
                           />
                           Verified
                        </Badge>
                     )}
                  </SheetTitle>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                     <HugeiconsIcon icon={Location01Icon} className="size-4" />
                     {spot.address ?? "Unknown address"}
                  </p>
               </div>

               <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-2">
                     <Button
                        variant="outline"
                        onClick={() => upvote(spot._id)}
                        className="flex items-center gap-1"
                     >
                        <HugeiconsIcon
                           icon={ThumbsUpIcon}
                           className={cn({
                              "fill-emerald-500":
                                 user &&
                                 upvotes.some(
                                    (upvote) => upvote.userId === user?.id
                                 ),
                           })}
                        />
                        <NumberFlow value={upvotes.length} />
                     </Button>
                     <Button
                        variant="outline"
                        onClick={() => downvote(spot._id)}
                        className="flex items-center gap-1"
                     >
                        <HugeiconsIcon
                           icon={ThumbsDownIcon}
                           className={cn({
                              "fill-rose-500":
                                 user &&
                                 downvotes.some(
                                    (downvote) => downvote.userId === user?.id
                                 ),
                           })}
                        />
                        <NumberFlow value={downvotes.length} />
                     </Button>
                  </div>

                  <div className="flex gap-2">
                     <Button
                        onClick={() => addToBookmark(spot._id)}
                        variant="outline"
                        size="icon"
                     >
                        <HugeiconsIcon
                           icon={Bookmark02Icon}
                           className={cn({
                              "fill-emerald-500":
                                 user &&
                                 bookmarks?.some(
                                    (bookmark) =>
                                       bookmark.userId === user?.id &&
                                       bookmark.spotId === spot._id
                                 ),
                           })}
                        />
                     </Button>
                     <ShareSpotModal spot={spot}>
                        <Button variant="outline" size="icon">
                           <HugeiconsIcon icon={Share08Icon} />
                        </Button>
                     </ShareSpotModal>
                     <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:bg-red-100 hover:text-red-500"
                     >
                        <HugeiconsIcon icon={Flag01Icon} />
                     </Button>
                  </div>
               </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-4">
               {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center text-muted-foreground relative min-h-full">
                     <HugeiconsIcon
                        icon={Comment01Icon}
                        className="size-10 opacity-40"
                     />
                     <p className="text-sm mt-2">No comments yet.</p>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {comments.map((c) => (
                        <div
                           key={c._id}
                           className="flex flex-col gap-3 bg-secondary p-3 rounded-lg"
                        >
                           <div className="flex items-center justify-between group">
                              <div className="flex items-center gap-2">
                                 <Avatar>
                                    <AvatarImage
                                       src={
                                          c.author?.imageUrl ??
                                          `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${c.author?.name}`
                                       }
                                    />
                                    <AvatarFallback className="font-medium">
                                       {c.author?.name.charAt(0)}
                                    </AvatarFallback>
                                 </Avatar>
                                 <div>
                                    <p className="block text-xs text-secondary-foreground">
                                       {c.author?.name ?? "Anonymous"}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground -mt-1">
                                       {c.author?.email}
                                    </p>
                                 </div>
                              </div>

                              {user && c.userId === user.id && (
                                 <button
                                    onClick={() => deleteComment(c._id)}
                                    className="opacity-0 group-hover:opacity-100 [&_svg]:size-4 text-destructive cursor-pointer"
                                 >
                                    <HugeiconsIcon
                                       icon={Delete02Icon}
                                       strokeWidth={1.5}
                                    />
                                 </button>
                              )}
                           </div>
                           <p className="text-sm">{c.text}</p>
                        </div>
                     ))}
                  </div>
               )}
            </div>

            <SheetFooter className="p-0">
               <AddCommentForm spotId={spot._id} />
            </SheetFooter>

            <Dialog
               open={!!selectedImage}
               onOpenChange={() => setSelectedImage(null)}
            >
               <DialogContent className="max-w-3xl p-0 overflow-hidden">
                  {selectedImage && (
                     <div className="relative w-full h-full min-h-[400px]">
                        {!fullLoaded && (
                           <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
                        )}
                        <Image
                           src={selectedImage}
                           alt="Preview"
                           width={1000}
                           height={800}
                           className={cn(
                              "object-contain w-full h-full transition-opacity duration-300",
                              fullLoaded ? "opacity-100" : "opacity-0"
                           )}
                           onLoadingComplete={() => setFullLoaded(true)}
                        />
                     </div>
                  )}
               </DialogContent>
            </Dialog>
         </SheetContent>
      </Sheet>
   );
}
