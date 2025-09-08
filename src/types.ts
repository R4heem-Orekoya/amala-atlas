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
