"use client";

import mapboxgl, { MarkerOptions } from "mapbox-gl";
import React, { useEffect, useRef } from "react";
import { useMap } from "@/context/map";
import { Doc } from "../../convex/_generated/dataModel";

type MarkerProps = {
   longitude: number;
   latitude: number;
   spot: Doc<"spots">;
   children?: React.ReactNode;
   onHover?: (isHovered: boolean, spot: Doc<"spots">) => void;
} & MarkerOptions;

export default function Marker({
   longitude,
   latitude,
   spot,
   children,
   ...props
}: MarkerProps) {
   const { map, setSelectedLocation } = useMap();
   const markerRef = useRef<HTMLDivElement | null>(null);
   const markerInstance = useRef<mapboxgl.Marker | null>(null);
   let marker: mapboxgl.Marker | null = null;

   useEffect(() => {
      const markerEl = markerRef.current;
      if (!map || !markerEl) return;

      const options = {
         element: markerEl,
         ...props,
      };

      marker = new mapboxgl.Marker(options)
         .setLngLat([spot.geocoords.long, spot.geocoords.lat])
         .addTo(map);

      return () => {
         if (marker) marker.remove();
      };
   }, [map, longitude, latitude, props]);

   return (
      <div>
         <div ref={markerRef}>{children}</div>
      </div>
   );
}
