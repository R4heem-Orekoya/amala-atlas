"use client";

import SideContent from "@/components/custom-ui/SideContent";
import useLocation from "@/hooks/use-location";
import { Input } from "@/components/ui/input";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
import SpotsTabs from "@/components/custom-ui/SpotsTab";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Map, { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import MapStyleControls from "@/components/map-style-controls";
import MapControls from "@/components/map-controls";
import { useRef } from "react";
import { LocationMarker } from "@/components/map-location-marker";
import { useSelectedSpot } from "@/hooks/use-selected-spot";
import { useQueryState } from "nuqs";

export default function Page() {
   const { selectedSpot } = useSelectedSpot();
   const mapRef = useRef<MapRef>(null);
   const { location } = useLocation();
   const [mapStyle] = useQueryState("mapStyle");

   const lng = location?.longitude ?? 3.3792;
   const lat = location?.latitude ?? 6.5244;

   const spots = useQuery(api.spots.nearby, {
      lat,
      lng,
      radiusKm: 8000,
   });

   return (
      <main className="relative grid grid-cols-1 lg:grid-cols-9 gap-4 py-6 px-4 min-h-screen lg:max-h-screen overflow-y-hidden">
         <div className="col-span-1 lg:col-span-3">
            <SideContent>
               <div className="w-full flex flex-col">
                  <div className="relative w-full">
                     <Input
                        className="peer ps-9 pe-9"
                        placeholder="Enter location manually..."
                        type="search"
                     />
                     <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                        <SearchIcon size={16} />
                     </div>
                     <button
                        className="text-muted-foreground/80 hover:text-foreground absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center"
                        aria-label="Submit search"
                        type="submit"
                     >
                        <ArrowRightIcon size={16} />
                     </button>
                  </div>
               </div>
               <SpotsTabs
                  nearbySpots={spots!}
                  isLoading={spots === undefined}
                  mapRef={mapRef}
                  lat={lat}
                  lng={lng}
               />
            </SideContent>
         </div>

         <div className="col-span-1 lg:col-span-6 max-lg:hidden border rounded-lg overflow-hidden">
            <Map
               ref={mapRef}
               mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
               initialViewState={{
                  longitude: lng,
                  latitude: lat,
                  zoom: 10,
               }}
               mapStyle={`mapbox://styles/mapbox/${mapStyle ? mapStyle : "standard"}`}
            >
               <MapStyleControls />
               <MapControls />
               {selectedSpot && <LocationMarker spot={selectedSpot} />}
               {spots &&
                  spots.map((spot) => (
                     <LocationMarker spot={spot} key={spot._id} />
                  ))}
            </Map>
         </div>
      </main>
   );
}
