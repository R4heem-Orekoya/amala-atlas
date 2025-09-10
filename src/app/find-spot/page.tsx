"use client";

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import SideContent from "@/components/custom-ui/SideContent";
import MapView from "@/components/custom-ui/MapView";
import useLocation from "@/hooks/use-location";
import { Spots } from "@/types";

export default function Page() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { location, loading } = useLocation();

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
          data={data}
          isLoading={isLoading}
          error={error}
        />
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
