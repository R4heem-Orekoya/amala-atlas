"use client";

import MapStyles from "@/components/map/styles";
import MapControls from "@/components/map/controls";
import { LocationMarker } from "../map-location-marker";
import { useMap } from "@/context/map";

type MapViewProps = {
   lng: number;
   lat: number;
   mapContainerRef: React.RefObject<HTMLDivElement | null>;
};
export default function MapView({ mapContainerRef }: MapViewProps) {
   const { selectedLocation } = useMap();

   return (
      <div className="sticky top-6  h-[calc(100vh-48px)]  border rounded-lg overflow-hidden">
         <div
            id="map-container"
            ref={mapContainerRef}
            className="absolute inset-0 h-full w-full"
         />
         {selectedLocation && <LocationMarker spot={selectedLocation} />}
         {/* {spots && 
            spots.map((spot) => <LocationMarker spot={spot} key={spot._id} />)} */}
         <MapControls />
         <MapStyles />
      </div>
   );
}
