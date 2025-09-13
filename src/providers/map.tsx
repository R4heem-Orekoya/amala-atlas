"use client";

import React, { PropsWithChildren } from "react";
import { MapProvider as Provider } from "react-map-gl/mapbox";

export default function MapProvider({ children }: PropsWithChildren) {
   return <Provider>{children}</Provider>;
}
