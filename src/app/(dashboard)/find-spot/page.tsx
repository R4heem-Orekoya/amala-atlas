"use client";

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import SideContent from "@/components/custom-ui/SideContent";
import MapView from "@/components/custom-ui/MapView";
import useLocation from "@/hooks/use-location";
import { Spots } from "@/types";
import { Input } from "@/components/ui/input";
import { ArrowRightIcon, MapPinned, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpotsTabs from "@/components/custom-ui/SpotsTab";

export default function Page() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { location, loading, refresh } = useLocation();

  const lng = location?.longitude ?? 3.3792;
  const lat = location?.latitude ?? 6.5244;

  const { data, isLoading, error } = useQuery({
    queryKey: ["amala-spots", lat, lng],
    queryFn: async () => {
      const res = await fetch(`/api/amala-spots?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      return data as Spots;
    },
    enabled: !loading && !!lat && !!lng,
  });

  return (
    <main className="relative grid grid-cols-1 lg:grid-cols-7 gap-4 p-6 lg:max-h-screen overflow-y-hidden">
      <div className="col-span-1 lg:col-span-2">
        <SideContent
        >
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
            <div className="flex items-center justify-between text-sm mt-2 p-2 rounded-md border bg-muted/30">
              {data &&
              data.context?.geo_bounds.circle?.center?.latitude === lat ? (
                <span className="text-muted-foreground">
                  <MapPinned className="w-5 h-5 inline-block mr-2" />
                  Using current location to get nearby spots
                </span>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={refresh}
                >
                  Use Current Location
                </Button>
              )}
            </div>
          </div>
          <SpotsTabs
            data={data}
            isLoading={isLoading}
            error={error}
          />
        </SideContent>
      </div>

      <div className="col-span-5">
        <MapView
          mapContainerRef={mapContainerRef}
          lng={lng}
          lat={lat}
        />
      </div>
    </main>
  );
}
