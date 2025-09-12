"use client";

import { SpotDetailsTrigger } from "@/components/custom-ui/SpotDetailsTrigger";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Chat01Icon,
  CheckmarkBadge01Icon,
  ChefHatIcon,
  InformationCircleIcon,
  Location01Icon,
  RulerIcon,
  StarIcon,
  Tag01Icon,
  ThumbsDownIcon,
  ThumbsUpIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import NavigateButton from "../navigate-button";
import { Badge } from "../ui/badge";

type SpotCardProps = {
  spot: Doc<"spots">;
  className?: string;
};

export default function SpotCard({ spot, className }: SpotCardProps) {
  const upvotes = useQuery(api.spots.upvotes, { spotId: spot._id }) ?? [];
  const downvotes = useQuery(api.spots.downvotes, { spotId: spot._id }) ?? [];
  const comments =
    useQuery(api.spots.comments, {
      spotId: spot._id,
      take: 20,
    }) ?? [];

  const isVerified = upvotes.length - downvotes.length >= 1;

  return (
    <div className={cn("px-4 py-5 mt-4 border rounded-lg", className)}>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="w-full flex items-center gap-2">
          <span className="grid place-items-center size-7 rounded-full bg-rose-500/20 text-rose-500">
            <HugeiconsIcon
              icon={ChefHatIcon}
              className="size-4"
            />
          </span>
          <div className="font-medium w-full flex items-center justify-between">
            <span>{spot.name}</span>
            {isVerified && (
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                <HugeiconsIcon
                  icon={CheckmarkBadge01Icon}
                  className="size-4"
                />
                Verified
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="py-6 text-muted-foreground space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <HugeiconsIcon
            icon={Location01Icon}
            className="size-4 shrink-0"
          />
          <span>{spot.address}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-[13px]">
          {spot.cuisine && (
            <div className="flex items-center gap-1">
              <HugeiconsIcon
                icon={ChefHatIcon}
                className="size-4 shrink-0 text-rose-500"
              />
              <span className="truncate">{spot.cuisine}</span>
            </div>
          )}

          {spot.rating && (
            <div className="flex items-center gap-1">
              <HugeiconsIcon
                icon={StarIcon}
                className="size-4 shrink-0 text-yellow-500"
              />
              <span>{spot.rating.toFixed(1)}</span>
            </div>
          )}

          {spot.tags && spot?.tags?.length > 0 && (
            <div className="flex items-center gap-1 col-span-2">
              <HugeiconsIcon
                icon={Tag01Icon}
                className="size-4 shrink-0 text-blue-500"
              />
              <span className="truncate">
                {spot?.tags.slice(0, 3).join(", ")}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <HugeiconsIcon
              icon={RulerIcon}
              className="size-4 shrink-0"
            />
            <span>{((spot.geocoords.lat ?? 0) / 1000).toFixed(1)} km away</span>
          </div>
          <div className="flex items-center gap-1">
            <HugeiconsIcon
              icon={ThumbsUpIcon}
              className="size-4 text-green-500"
            />
            <span>{upvotes.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <HugeiconsIcon
              icon={ThumbsDownIcon}
              className="size-4 text-rose-500"
            />
            <span>{downvotes.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <HugeiconsIcon
              icon={Chat01Icon}
              className="size-4 text-blue-500"
            />
            <span>{comments.length}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
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
            />
            Details
          </Button>
        </SpotDetailsTrigger>
      </div>
    </div>
  );
}
