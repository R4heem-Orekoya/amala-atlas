"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { MapsIcon, Satellite02Icon, PineTreeIcon, Sun02Icon, Moon02Icon } from "@hugeicons/core-free-icons";
import { Button } from "./ui/button";
import { useQueryState } from "nuqs";
import { useMap } from "react-map-gl/mapbox";

type StyleOption = {
   id: string;
   label: string;
   icon: React.ReactNode;
};

const STYLE_OPTIONS: StyleOption[] = [
   {
      id: "streets-v12",
      label: "Map",
      icon: <HugeiconsIcon icon={MapsIcon} className="size-4" />,
   },
   {
      id: "satellite-streets-v12",
      label: "Satellite",
      icon: <HugeiconsIcon icon={Satellite02Icon} className="size-4" />,
   },
   {
      id: "outdoors-v12",
      label: "Terrain",
      icon: <HugeiconsIcon icon={PineTreeIcon} className="size-4" />,
   },
   {
      id: "light-v11",
      label: "Light",
      icon: <HugeiconsIcon icon={Sun02Icon} className="size-4" />,
   },
   {
      id: "dark-v11",
      label: "Dark",
      icon: <HugeiconsIcon icon={Moon02Icon} className="size-4" />,
   },
];

export default function MapStyleControls() {
   const { current: map } = useMap();
   const [mapStyle, setMapStyle] = useQueryState("mapStyle", {
      defaultValue: "streets-v12",
   });

   if (!map) return null;

   return (
      <div className="absolute left-4 bottom-4 flex items-center gap-2 p-1 bg-background rounded-lg z-[999] font-sans">
         {STYLE_OPTIONS.map((style) => (
            <Button
               key={style.id}
               size="sm"
               variant={mapStyle === style.id ? "default" : "link"}
               onClick={() => {
                  map.getMap().setStyle(`mapbox://styles/mapbox/${style.id}`);
                  setMapStyle(style.id);
               }}
               className="text-sm flex items-center hover:no-underline sm:px-3 sm:py-1.5 rounded-sm"
            >
               {style.icon}
               <span className="hidden sm:inline">{style.label}</span>
            </Button>
         ))}
      </div>
   );
}
