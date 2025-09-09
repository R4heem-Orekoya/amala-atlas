"use client";

import { Button } from "@/components/ui/button";
import {
  Bookmark,
  EllipsisVertical,
  Flag,
  Info,
  MapPin,
  Navigation,
  Ruler,
  Share2,
  Utensils,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SpotDetailsTrigger } from "@/components/custom-ui/SpotDetailsTrigger";
import { Spots } from "@/types";
import { ShareSpotModal } from "./ShareSpotModal";

type SpotCardProps = {
  spot: Spots["results"][0];
};

export default function SpotCard({ spot }: SpotCardProps) {
  return (
    <div className="p-4 mt-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-2">
          <Utensils className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-semibold">{spot.name}</h2>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 rounded-full hover:bg-muted transition cursor-pointer">
            <EllipsisVertical className="h-5 w-5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-48"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
              <Flag className="mr-2 h-4 w-4" /> Flag
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-blue-600 focus:text-blue-700 focus:bg-blue-50">
              <Bookmark className="mr-2 h-4 w-4" /> Bookmark
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-green-600 focus:text-green-700 focus:bg-green-50">
              <ShareSpotModal spot={spot}>
                <Share2 className="mr-2 h-4 w-4" /> Share
              </ShareSpotModal>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-purple-600 focus:text-purple-700 focus:bg-purple-50">
              <MapPin className="mr-2 h-4 w-4" /> Get Directions
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4 shrink-0" />
        <span>{spot.location.formatted_address}</span>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
        <Ruler className="w-4 h-4 shrink-0" />
        <span>{((spot.distance ?? 0) / 1000).toFixed(1)} km away</span>
      </div>

      <div className="flex gap-2">
        <Button className="flex-1 mt-4 flex items-center gap-2">
          <Navigation className="w-4 h-4" /> Navigate
        </Button>
        <SpotDetailsTrigger spot={spot}>
          <Button
            variant="outline"
            className="flex-1 mt-4 flex items-center gap-2"
          >
            <Info className="w-4 h-4" /> Details
          </Button>
        </SpotDetailsTrigger>
      </div>
    </div>
  );
}
