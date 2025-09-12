"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Navigation03Icon } from "@hugeicons/core-free-icons";
import { Button } from "./ui/button";
import { Doc } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { useMap } from "@/context/map";
import { toast } from "sonner";
import { LocationMarker } from "./location-marker";

interface NavigateButtonProps {
   spot: Doc<"spots">;
}

export default function NavigateButton({ spot }: NavigateButtonProps) {
   const { map, setSelectedLocation } = useMap();
   const [isSearching, setIsSearching] = useState(false);

   async function handleClick() {
      try {
         setIsSearching(true);
         setSelectedLocation(spot)
         
         if (map && spot.geocoords) {
            map.flyTo({
               center: [spot.geocoords.long, spot.geocoords.lat],
               zoom: 14,
               speed: 1.5,
               duration: 2000,
               essential: true,
            });
         } else {
            toast.error("No map instance or coordinates found");
         }
      } catch (err) {
         toast.error(
            err instanceof Error ? err.message : "Something went wrong!"
         );
         console.error("Retrieve error:", err);
      } finally {
         setIsSearching(false);
      }
   }

   return (
      <>
         <Button
            className="flex-1 flex items-center gap-2"
            onClick={handleClick}
            disabled={isSearching}
         >
            <HugeiconsIcon icon={Navigation03Icon} className="size-4" />
            {isSearching ? "Locating..." : "Navigate"}
         </Button>
      </>
   );
}
