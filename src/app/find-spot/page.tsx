"use client";

import { useEffect, useRef } from "react";

import MapStyles from "@/components/map/styles";
import MapCotrols from "@/components/map/controls";
import MapProvider from "../providers/mapbox";
import useLocation from "@/hooks/use-location";
import { useQuery } from "@tanstack/react-query";
import { Spots } from "@/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
   ArrowRightIcon,
   MapPin,
   Navigation,
   Ruler,
   SearchIcon,
   Utensils,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Page() {
   const mapContainerRef = useRef<HTMLDivElement | null>(null);
   const { location, loading, refresh } = useLocation();

   const lng = location?.longitude ?? 3.3792;
   const lat = location?.latitude ?? 6.5244;

   console.log(lng, lat);

   const { data, isLoading, error } = useQuery({
      queryKey: ["amala-spots", lat, lng],
      queryFn: async () => {
         const res = await fetch(`/api/amala-spots?lat=${lat}&lng=${lng}`);
         const data = await res.json();
         return data as Spots;
      },
      enabled: !loading && !!lat && !!lng,
   });

   console.log(data);

   return (
      <main className="relative grid grid-cols-1 lg:grid-cols-7 gap-4 p-6 min-h-screen">
         <div className="col-span-1 lg:col-span-2">
            <div className="sticky top-6 flex flex-col max-h-[calc(100vh-48px)]">
               <div className="w-full flex flex-col">
                  <div className="relative w-full">
                     <Input
                        className="peer ps-9 pe-9"
                        placeholder="Enter location manually..."
                        type="search"
                     />
                     <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                        <SearchIcon size={16} />
                     </div>
                     <button
                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Submit search"
                        type="submit"
                     >
                        <ArrowRightIcon size={16} aria-hidden="true" />
                     </button>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2 p-2 rounded-md border bg-muted/30">
                     {data && data.context?.geo_bounds.circle?.center?.latitude === lat ? (
                        <span className="text-muted-foreground">
                           Using current location to get nearby spots
                        </span>
                     ) : (
                        <Button size="sm" variant="outline" onClick={refresh}>
                           Use Current Location
                        </Button>
                     )}
                  </div>
               </div>
               <ScrollArea className="overflow-y-auto flex-1 flex flex-col mt-2">
                  {isLoading && <p>Loading spots...</p>}
                  {error && <p>Failed to load spots</p>}
                  {data?.results.map((spot) => (
                     <div
                        key={spot.fsq_place_id}
                        className="p-4 mt-4 border rounded-lg"
                     >
                        <div className="flex items-center gap-2 mb-2">
                           <Utensils className="w-5 h-5 text-red-500" />
                           <h2 className="text-lg font-semibold">
                              {spot.name}
                           </h2>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           <MapPin className="w-4 h-4 shrink-0" />
                           <span>{spot.location.formatted_address}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                           <Ruler className="w-4 h-4 shrink-0" />
                           <span>
                              {((spot.distance ?? 0) / 1000).toFixed(1)} km away
                           </span>
                        </div>

                        <Button className="w-full mt-4 flex items-center gap-2">
                           <Navigation className="w-4 h-4" />
                           Navigate
                        </Button>
                     </div>
                  ))}
               </ScrollArea>
            </div>
         </div>

         <div className="col-span-5">
            <div className="sticky top-6 h-[calc(100vh-48px)] border rounded-lg overflow-hidden">
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
                  {/* <MapSearch /> */}
                  <MapCotrols />
                  <MapStyles />
               </MapProvider>
            </div>
         </div>
      </main>
   );
}
