export interface AmalaSpot {
   id: string;
   name: string;
   address: string;
   coordinates: [number, number];
   description: string;
   photos: string[];
   rating: number;
   reviewCount: number;
   verified: boolean;
   addedBy: string;
   dateAdded: string;
   tags: string[];
   priceRange: "$" | "$$" | "$$$";
   openHours?: string;
   phone?: string;
   specialties: string[];
}

export interface PlaceCategory {
   fsq_category_id: string;
   name: string;
   plural_name: string;
   short_name: string;
   icon: {
      prefix: string;
      suffix: string;
   };
}

export interface PlaceLocation {
   address?: string;
   country: string;
   formatted_address: string;
   locality?: string;
   postcode?: string;
   region?: string;
}

export interface Spots {
   results: Place[];
   context: { geo_bounds: GeoBounds };
}

export interface Place {
   fsq_place_id: string;
   name: string;
   latitude: number;
   longitude: number;
   distance?: number;
   categories: PlaceCategory[];
   location: PlaceLocation;
   link?: string;
   placemaker_url?: string;
   related_places?: Record<string, unknown>;
   social_media?: {
      twitter?: string;
      [key: string]: string | undefined;
   };
   date_created?: string;
   date_refreshed?: string;
}

type GeoBounds = {
   circle: {
      center: {
         latitude: number;
         longitude: number;
      };
      radius: number;
   };
};
