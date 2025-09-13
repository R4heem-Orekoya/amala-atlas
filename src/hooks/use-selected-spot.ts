import { create } from "zustand";
import { Doc } from "../../convex/_generated/dataModel";

interface SelectedSpotState {
   selectedSpot: Doc<"spots"> | null;
   setSelectedSpot: (spot: Doc<"spots"> | null) => void;
}

export const useSelectedSpot = create<SelectedSpotState>((set) => ({
   selectedSpot: null,
   setSelectedSpot: (spot) => set({ selectedSpot: spot }),
}));
