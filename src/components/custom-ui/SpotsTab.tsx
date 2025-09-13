"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import SpotCard from "./SpotCard";
import Map, { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import MapStyleControls from "@/components/map-style-controls";
import MapControls from "../map-controls";
import { LocationMarker } from "../map-location-marker";
import { useSelectedSpot } from "@/hooks/use-selected-spot";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";

type SpotsTabsProps = {
   nearbySpots: Doc<"spots">[];
   isLoading: boolean;
   mapRef: React.RefObject<MapRef | null>;
   lng: number;
   lat: number;
};

export default function SpotsTabs({
   nearbySpots,
   isLoading,
   mapRef,
   lat,
   lng,
}: SpotsTabsProps) {
   const { selectedSpot } = useSelectedSpot();
   const [mapStyle] = useQueryState("mapStyle");
   const [activeTab, setActiveTab] = useQueryState("activeTab", {
      defaultValue: "verified",
   });
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
         defaultValue={activeTab}
         onValueChange={(value) => setActiveTab(value)}
         className="flex-1 flex flex-col mt-4 min-h-full"
      >
         <TabsList className="w-full justify-between border-b rounded-none bg-transparent p-0">
            <TabsTrigger
               value="verified"
               className="relative rounded-none border-b-2 data-[state=active]:border-b-primary data-[state=active]:shadow-none px-0 py-2 text-muted-foreground text-xs sm:text-sm font-medium 
               data-[state=active]:text-primary cursor-pointer"
            >
               Verified Spots
            </TabsTrigger>
            <TabsTrigger
               value="user"
               className="relative rounded-none border-b-2 data-[state=active]:border-b-primary data-[state=active]:shadow-none px-0 py-2 text-muted-foreground text-xs sm:text-sm font-medium 
               data-[state=active]:text-primary cursor-pointer"
            >
               User&apos;s Spots
            </TabsTrigger>
            <TabsTrigger
               value="ai"
               className="relative rounded-none border-b-2 data-[state=active]:border-b-primary data-[state=active]:shadow-none px-0 py-2 text-muted-foreground text-xs sm:text-sm font-medium 
               data-[state=active]:text-primary cursor-pointer"
            >
               AI Suggestions
            </TabsTrigger>
            <TabsTrigger
               value="map"
               className="relative rounded-none border-b-2 data-[state=active]:border-b-primary data-[state=active]:shadow-none px-0 py-2 text-muted-foreground text-xs sm:text-sm font-medium 
               data-[state=active]:text-primary cursor-pointer lg:hidden"
            >
               Map
            </TabsTrigger>
         </TabsList>

         <ScrollArea className="overflow-y-auto flex-1 flex flex-col">
            <TabsContent value="verified" className="flex flex-col flex-1">
               {isLoading && <p>Loading spots...</p>}
               {verifiedSpots?.map((spot) => (
                  <SpotCard key={spot._id} spot={spot} mapRef={mapRef} />
               ))}
            </TabsContent>

            <TabsContent value="user" className="flex flex-col flex-1">
               {isLoading && <p>Loading spots...</p>}
               {nearbySpots?.map((spot) => (
                  <SpotCard key={spot._id} spot={spot} mapRef={mapRef} />
               ))}
            </TabsContent>

            <TabsContent value="ai" className="flex flex-col flex-1">
               <div className="p-4 mt-4 border rounded-lg">
                  AI Suggestion Placeholder
               </div>
            </TabsContent>
            <TabsContent
               value="map"
               className="flex flex-col flex-1 lg:hidden"
               forceMount
            >
               <div
                  className={cn("mt-4 h-[600px] rounded-lg hidden", {
                     block: activeTab === "map",
                  })}
               >
                  <Map
                     id="mobile-map"
                     reuseMaps
                     mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                     initialViewState={{
                        longitude: lng,
                        latitude: lat,
                        zoom: 10,
                     }}
                     style={{ width: "100%", height: "100%" }}
                     mapStyle={`mapbox://styles/mapbox/${
                        mapStyle ? mapStyle : "standard"
                     }`}
                  >
                     <MapStyleControls />
                     <MapControls />
                     {selectedSpot && <LocationMarker spot={selectedSpot} />}
                     {nearbySpots &&
                        nearbySpots.map((spot) => (
                           <LocationMarker spot={spot} key={spot._id} />
                        ))}
                  </Map>
               </div>
            </TabsContent>
         </ScrollArea>
      </Tabs>
   );
}
