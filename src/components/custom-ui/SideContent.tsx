"use client";

import { ArrowRightIcon, MapPinned, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SpotsTabs from "./SpotsTab";
import useLocation from "@/hooks/use-location";
import { Spots } from "@/types";

type SidebarProps = {
  data?: Spots;
  isLoading: boolean;
  error: unknown;
};

export default function SideContent({ data, isLoading, error }: SidebarProps) {
  const { location, refresh } = useLocation();
  const lat = location?.latitude;

  return (
    <div className="sticky top-6 flex flex-col max-h-[calc(100vh-48px)]">
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
          {data && data.context?.geo_bounds.circle?.center?.latitude === lat ? (
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
    </div>
  );
}
