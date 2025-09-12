"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import SpotCard from "./SpotCard";

type SpotsTabsProps = {
  nearbySpots: Doc<"spots">[];
  isLoading: boolean;
};

export default function SpotsTabs({ nearbySpots, isLoading }: SpotsTabsProps) {
  const allUpvotes = useQuery(api.spots.allUpvotes) ?? [];
  const allDownvotes = useQuery(api.spots.allDownvotes) ?? [];

  const upvoteCountBySpot: Record<Id<"spots">, number> = {};
  allUpvotes.forEach((u) => {
    upvoteCountBySpot[u.spotId] = (upvoteCountBySpot[u.spotId] ?? 0) + 1;
  });

  const downvoteCountBySpot: Record<Id<"spots">, number> = {};
  allDownvotes.forEach((d) => {
    downvoteCountBySpot[d.spotId] = (downvoteCountBySpot[d.spotId] ?? 0) + 1;
  });

  const spotsWithVotes = nearbySpots?.map((spot) => {
    const upvotes = upvoteCountBySpot[spot._id] ?? 0;
    const downvotes = downvoteCountBySpot[spot._id] ?? 0;
    return {
      ...spot,
      upvotes,
      downvotes,
      isVerified: upvotes - downvotes >= 1,
    };
  });

  const verifiedSpots = spotsWithVotes?.filter((s) => s.isVerified);

  return (
    <Tabs
      defaultValue="verified"
      className="flex-1 flex flex-col mt-4 min-h-full"
    >
      <TabsList className="bg-transparent my-2 w-full justify-between">
        <TabsTrigger value="verified">Verified Spots</TabsTrigger>
        <TabsTrigger value="user">User&apos;s Spots</TabsTrigger>
        <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
      </TabsList>

      <ScrollArea className="overflow-y-auto flex-1 flex flex-col">
        <TabsContent
          value="verified"
          className="flex flex-col flex-1"
        >
          {isLoading && <p>Loading spots...</p>}
          {verifiedSpots?.map((spot) => (
            <SpotCard
              key={spot._id}
              spot={spot}
            />
          ))}
        </TabsContent>

        <TabsContent
          value="user"
          className="flex flex-col flex-1"
        >
          {isLoading && <p>Loading bookmarked spots...</p>}
          {nearbySpots?.map(
            (spot) =>
                <SpotCard
                  key={spot._id}
                  spot={spot}
                />
          )}
        </TabsContent>

        <TabsContent
          value="ai"
          className="flex flex-col flex-1"
        >
          <div className="p-4 mt-4 border rounded-lg">
            AI Suggestion Placeholder
          </div>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}
