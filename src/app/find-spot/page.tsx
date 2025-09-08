"use client";

import { useRef } from "react";

import MapStyles from "@/components/map/styles";
import MapCotrols from "@/components/map/controls";
import MapSearch from "@/components/map/search";
import MapProvider from "../providers/mapbox";
import useLocation from "@/hooks/use-location";

export default function Home() {
   const mapContainerRef = useRef<HTMLDivElement | null>(null);
   const { location } = useLocation();

   const lng = location?.longitude ?? 3.3792;
   const lat = location?.latitude ?? 6.5244;

   return (
      <main>
         <div className="w-screen h-screen">
            <div
               id="map-container"
               ref={mapContainerRef}
               className="absolute inset-0 h-full w-full"
            />

            <MapProvider
               mapContainerRef={mapContainerRef}
               initialViewState={{
                  longitude: lng,
                  latitude: lat,
                  zoom: 14,
               }}
            >
               <MapSearch />
               <MapCotrols />
               <MapStyles />
            </MapProvider>
         </div>
      </main>
   );
}
