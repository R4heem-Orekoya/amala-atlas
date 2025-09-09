"use client";

import MapStyles from "@/components/map/styles";
import MapControls from "@/components/map/controls";
import MapProvider from "@/app/providers/mapbox";

type MapViewProps = {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  lng: number;
  lat: number;
};
export default function MapView({ mapContainerRef, lng, lat }: MapViewProps) {
  return (
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
        <MapControls />
        <MapStyles />
      </MapProvider>
    </div>
  );
}
