"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import {
   Bookmark,
   Flag,
   MapPin,
   MessageSquare,
   Send,
   Share2,
   ThumbsDown,
   ThumbsUp,
} from "lucide-react";
import { ShareSpotModal } from "./ShareSpotModal";
import { Doc } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import AddCommentForm from "../add-comment-form";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type SpotDetailsTriggerProps = {
   children: React.ReactNode;
   spot: Doc<"spots">;
};

export function SpotDetailsTrigger({
   children,
   spot,
}: SpotDetailsTriggerProps) {
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

   return (
      <Sheet>
         <SheetTrigger asChild>{children}</SheetTrigger>
         <SheetContent
            side="right"
            className="w-full sm:max-w-md h-[100dvh] p-0 flex flex-col"
         >
            <SheetHeader className="p-4 border-b">
               <div className="h-40 w-full rounded-md overflow-hidden bg-muted relative mt-7">
                  {false ? (
                     <div className="w-full h-full ">
                        {/* <Image
                           src={spot.imageUrl}
                           alt={spot.name}
                           fill
                           className="object-cover"
                        /> */}
                     </div>
                  ) : (
                     <div className="flex items-center justify-center h-full text-muted-foreground">
                        <MapPin className="w-12 h-12 opacity-40" />
                     </div>
                  )}
               </div>
               <div className="mt-3">
                  <SheetTitle className="text-xl font-semibold">
                     {spot?.name ?? "Amala Spot"}
                  </SheetTitle>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                     <MapPin className="w-4 h-4 shrink-0" />
                     {spot.address ?? "Unknown address"}
                  </p>
               </div>
               <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-2">
                     <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {}}
                        className="flex items-center gap-1"
                     >
                        <ThumbsUp className="w-4 h-4" /> {upvotes.length}
                     </Button>
                     <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {}}
                        className="flex items-center gap-1"
                     >
                        <ThumbsDown className="w-4 h-4" /> {downvotes.length}
                     </Button>
                  </div>

                  <div className="flex gap-2">
                     <Button variant="outline" size="sm">
                        <Bookmark className="w-4 h-4" />
                     </Button>
                     <ShareSpotModal spot={spot}>
                        <Button variant="outline" size="sm">
                           <Share2 className="w-4 h-4" />
                        </Button>
                     </ShareSpotModal>
                     <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                     >
                        <Flag className="w-4 h-4" />
                     </Button>
                  </div>
               </div>
            </SheetHeader>
            <ScrollArea className="flex-1 p-4 ">
               {comments.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground mt-20 relative min-h-full">
                     <MessageSquare className="w-12 h-12 mb-2 opacity-40" />
                     <p className="text-sm">
                        No comments yet. Be the first to share!
                     </p>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {comments.map((c) => (
                        <div key={c._id} className="flex flex-col gap-3 bg-secondary p-3 rounded-lg">
                           <div className="flex items-center gap-3">
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
                              <span className="block text-xs text-secondary-foreground">
                                 {c.author?.name ?? "Anonymous"}
                              </span>
                           </div>
                              <p className="text-sm">
                                 {c.text}
                              </p>
                        </div>
                     ))}
                  </div>
               )}
            </ScrollArea>
            <AddCommentForm spotId={spot._id} />
         </SheetContent>
      </Sheet>
   );
}
