"use client";

import { MapPin } from "lucide-react";
import Marker from "./marker";
import { Doc } from "../../convex/_generated/dataModel";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import SpotCard from "./custom-ui/SpotCard";
import { MapRef, useMap } from "react-map-gl/mapbox";
import { useRef } from "react";

interface LocationMarkerProps {
   spot: Doc<"spots">;
}

export function LocationMarker({ spot }: LocationMarkerProps) {
   const { current: map } = useMap()
   const mapRef = useRef(map as MapRef | null)
   
   return (
      <Marker
         longitude={spot.geocoords.long}
         latitude={spot.geocoords.lat}
         spot={spot}
      >
         <Popover>
            <PopoverTrigger asChild>
               <div className="bg-rose-500 rounded-full flex items-center justify-center transform transition-all duration-200 shadow-lg size-8 cursor-pointer hover:scale-110">
                  <MapPin className="stroke-[2.5px] size-4 text-white" />
               </div>
            </PopoverTrigger>

            <PopoverContent side="top" align="center" className="w-96 p-0">
               <SpotCard
                  spot={spot}
                  className="mt-0 border-none"
                  mapRef={mapRef}
               />
            </PopoverContent>
         </Popover>
      </Marker>
   );
}
