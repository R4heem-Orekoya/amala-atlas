"use client";

import { useEffect, useState } from "react";

type Location = {
   latitude: number;
   longitude: number;
};

export default function useLocation() {
   const [location, setLocation] = useState<Location | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      if (!navigator.geolocation) {
         setError("Geolocation is not supported by your browser");
         setLoading(false);
         return;
      }

      navigator.geolocation.getCurrentPosition(
         (pos) => {
            setLocation({
               latitude: pos.coords.latitude,
               longitude: pos.coords.longitude,
            });
            setLoading(false);
         },
         (err) => {
            setError(err.message);
            setLoading(false);
         }
      );
   }, []);

   return { location, loading, error };
}
