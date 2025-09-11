"use client";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
   ChefHatIcon,
   Bookmark02Icon,
   Share08Icon,
   Flag01Icon,
   Location01Icon,
   InformationCircleIcon,
   RulerIcon,
   CheckmarkBadge01Icon, // ✅ Verified badge icon
} from "@hugeicons/core-free-icons";
import { EllipsisVertical } from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SpotDetailsTrigger } from "@/components/custom-ui/SpotDetailsTrigger";
import { ShareSpotModal } from "./ShareSpotModal";
import { Doc } from "../../../convex/_generated/dataModel";
import NavigateButton from "../navigate-button";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Badge } from "../ui/badge";

type SpotCardProps = {
   spot: Doc<"spots">;
   className?: string;
};

export default function SpotCard({ spot, className }: SpotCardProps) {
   const upvotes =
      useQuery(api.spots.upvotes, {
         spotId: spot._id,
      }) ?? [];

   const downvotes =
      useQuery(api.spots.downvotes, {
         spotId: spot._id,
      }) ?? [];

   const isVerified = upvotes.length - downvotes.length >= 1;

   return (
      <div className={cn("px-4 py-5 mt-4 border rounded-lg", className)}>
         <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
               <span className="grid place-items-center size-7 rounded-full bg-rose-500/20 text-rose-500">
                  <HugeiconsIcon icon={ChefHatIcon} className="size-4" />
               </span>
               <h2 className="font-medium flex items-center gap-1">
                  {spot.name}
                  {isVerified && (
                     <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                        <HugeiconsIcon
                           icon={CheckmarkBadge01Icon}
                           className="size-4 "
                        />
                        Verified
                     </Badge>
                  )}
               </h2>
            </div>
            <DropdownMenu>
               <DropdownMenuTrigger className="p-2 rounded-full hover:bg-muted transition cursor-pointer">
                  <EllipsisVertical className="size-4 text-muted-foreground" />
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                     <HugeiconsIcon
                        icon={Flag01Icon}
                        className="mr-2 size-4 text-rose-500"
                     />{" "}
                     Flag
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                     <HugeiconsIcon
                        icon={Bookmark02Icon}
                        className="mr-2 h-4 w-4 text-blue-500"
                     />{" "}
                     Bookmark
                  </DropdownMenuItem>
                  <ShareSpotModal spot={spot}>
                     <Button
                        variant="secondary"
                        className="justify-start w-full bg-transparent shadow-none border-none cursor-pointer"
                     >
                        <HugeiconsIcon
                           icon={Share08Icon}
                           className="mr-2 size-4 text-green-500"
                        />{" "}
                        Share
                     </Button>
                  </ShareSpotModal>
                  <DropdownMenuItem className="cursor-pointer">
                     <HugeiconsIcon
                        icon={Location01Icon}
                        className="mr-2 size-4 text-purple-500"
                     />{" "}
                     Get Directions
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>

         <div className="py-6 text-muted-foreground">
            <div className="flex items-center gap-2 text-sm">
               <HugeiconsIcon
                  icon={Location01Icon}
                  className="size-4 shrink-0"
               />
               <span>{spot.address}</span>
            </div>

            <div className="flex items-center gap-2 text-xs mt-1">
               <HugeiconsIcon icon={RulerIcon} className="size-4 shrink-0" />
               <span>
                  {((spot.geocoords.lat ?? 0) / 1000).toFixed(1)} km away
               </span>
            </div>
         </div>

         <div className="flex gap-2">
            <NavigateButton spot={spot} />
            <SpotDetailsTrigger spot={spot}>
               <Button
                  variant="outline"
                  className="flex-1 flex items-center gap-2"
               >
                  <HugeiconsIcon
                     icon={InformationCircleIcon}
                     className="size-4"
                  />{" "}
                  Details
               </Button>
            </SpotDetailsTrigger>
         </div>
      </div>
   );
}
