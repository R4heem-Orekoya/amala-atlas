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
} from "@hugeicons/core-free-icons";
import { ShareSpotModal } from "./ShareSpotModal";
import { Doc } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import AddCommentForm from "../add-comment-form";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "@clerk/nextjs";

type SpotDetailsTriggerProps = {
   children: React.ReactNode;
   spot: Doc<"spots">;
};

export function SpotDetailsTrigger({
   children,
   spot,
}: SpotDetailsTriggerProps) {
   const { user } = useUser();

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
            className="w-full sm:max-w-md h-[100dvh] p-0 flex flex-col gap-0"
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
                  </SheetTitle>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                     <HugeiconsIcon icon={Location01Icon} />
                     {spot.address ?? "Unknown address"}
                  </p>
               </div>
               <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-2">
                     <Button
                        variant="outline"
                        onClick={() => {}}
                        className="flex items-center gap-1"
                     >
                        <HugeiconsIcon icon={ThumbsUpIcon} /> {upvotes.length}
                     </Button>
                     <Button
                        variant="outline"
                        onClick={() => {}}
                        className="flex items-center gap-1"
                     >
                        <HugeiconsIcon icon={ThumbsDownIcon} />{" "}
                        {downvotes.length}
                     </Button>
                  </div>

                  <div className="flex gap-2">
                     <Button variant="outline" size="icon">
                        <HugeiconsIcon icon={Bookmark02Icon} />
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
                                 <button className="opacity-0 group-hover:opacity-100 [&_svg]:size-4 text-destructive cursor-pointer">
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
         </SheetContent>
      </Sheet>
   );
}
