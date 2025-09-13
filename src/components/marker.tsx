"use client";

import { Marker as MapboxMarker } from "react-map-gl/mapbox";
import React from "react";
import { Doc } from "../../convex/_generated/dataModel";

type MarkerProps = {
   longitude: number;
   latitude: number;
   spot: Doc<"spots">;
   children?: React.ReactNode;
   hoverAction?: (isHovered: boolean, spot: Doc<"spots">) => void;
   clickAction?: (spot: Doc<"spots">) => void;
};

export default function Marker({
   longitude,
   latitude,
   spot,
   children,
   hoverAction,
   clickAction,
}: MarkerProps) {
   return (
      <MapboxMarker longitude={longitude} latitude={latitude} anchor="bottom">
         <div
            onMouseEnter={() => hoverAction?.(true, spot)}
            onMouseLeave={() => hoverAction?.(false, spot)}
            onClick={() => clickAction?.(spot)}
            className="cursor-pointer"
         >
            {children}
         </div>
      </MapboxMarker>
   );
}
