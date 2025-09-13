"use client";

import React from "react";
import { Button } from "./ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
   PlusSignIcon,
   MinusSignIcon
} from "@hugeicons/core-free-icons";
import { useMap } from "react-map-gl/mapbox";

export default function MapControls() {
   const { current: map } = useMap();
   
   if(!map) return null;

   const zoomIn = () => {
      map.zoomIn();
   };

   const zoomOut = () => {
      map.zoomOut();
   };

   return (
      <div className="absolute bottom-12 right-4 z-10 bg-background p-2 rounded-lg shadow-lg flex flex-col gap-2">
         <Button variant="ghost" size="icon" onClick={zoomIn}>
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
            <span className="sr-only">Zoom in</span>
         </Button>
         <Button variant="ghost" size="icon" onClick={zoomOut}>
            <HugeiconsIcon icon={MinusSignIcon} className="size-4" />
            <span className="sr-only">Zoom out</span>
         </Button>
      </div>
   );
}
