import { type Map } from "mapbox-gl";
import { createContext, useContext } from "react";
import { Doc } from "../../convex/_generated/dataModel";

interface MapContextType {
   map: Map;
   selectedLocation: Doc<"spots"> | null;
   setSelectedLocation: (loc: Doc<"spots"> | null) => void;
}

export const MapContext = createContext<MapContextType | null>(null);

export function useMap() {
   const context = useContext(MapContext);
   if (!context) {
      throw new Error("useMap must be used within a MapProvider");
   }
   return context;
}
