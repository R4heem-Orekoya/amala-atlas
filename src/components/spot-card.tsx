import { AmalaSpot } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
   Star,
   MapPin,
   Clock,
   Phone,
   Verified,
   ThumbsUp,
   Flag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SpotCardProps {
   spot: AmalaSpot;
   onVerify?: (spotId: string) => void;
   onFlag?: (spotId: string) => void;
   onViewDetails?: (spot: AmalaSpot) => void;
   showActions?: boolean;
}

export default function SpotCard({
   spot,
   onFlag,
   onVerify,
   onViewDetails,
   showActions,
}: SpotCardProps) {
   return (
      <Card className="shadow-card hover:shadow-warm pt-0 transition-smooth overflow-hidden">
         <div className="h-48 bg-gradient-to-t from-primary/10 to-accent/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
            <div className="absolute top-3 left-3">
               {spot.verified ? (
                  <Badge
                     className="bg-emerald-500 py-1"
                  >
                     <Verified className="w-3 h-3" />
                     Verified
                  </Badge>
               ) : (
                  <Badge
                     className="bg-amber-500 text-warning-foreground border-warning"
                  >
                     Pending Review
                  </Badge>
               )}
            </div>
            <div className="absolute top-3 right-3">
               <Badge
                  variant="secondary"
                  className="bg-card/90 text-card-foreground"
               >
                  {spot.priceRange}
               </Badge>
            </div>

            <div className="flex items-center justify-center h-full text-muted-foreground">
               <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-75">Photo coming soon</p>
               </div>
            </div>
         </div>

         <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
               <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground leading-tight">
                     {spot.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                     <MapPin className="w-4 h-4 text-muted-foreground" />
                     <p className="text-sm text-muted-foreground">
                        {spot.address}
                     </p>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-4 mt-3">
               <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-foreground">
                     {spot.rating}
                  </span>
                  <span className="text-sm text-muted-foreground">
                     ({spot.reviewCount} reviews)
                  </span>
               </div>
            </div>
         </CardHeader>

         <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">
               {spot.description}
            </p>

            <div className="space-y-2 text-sm">
               {spot.openHours && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                     <Clock className="w-4 h-4" />
                     {spot.openHours}
                  </div>
               )}
               {spot.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                     <Phone className="w-4 h-4" />
                     {spot.phone}
                  </div>
               )}
            </div>

            <div className="flex flex-wrap gap-1">
               {spot.specialties.slice(0, 3).map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                     {specialty}
                  </Badge>
               ))}
               {spot.specialties.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                     +{spot.specialties.length - 3} more
                  </Badge>
               )}
            </div>

            <div className="flex flex-wrap gap-1">
               {spot.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                     #{tag}
                  </Badge>
               ))}
            </div>

            {showActions && (
               <div className="flex gap-2 pt-2">
                  <Button
                     variant="default"
                     size="sm"
                     className="flex-1"
                     onClick={() => onViewDetails?.(spot)}
                  >
                     View Details
                  </Button>

                  {!spot.verified && (
                     <>
                        <Button size="sm" onClick={() => onVerify?.(spot.id)}>
                           <ThumbsUp className="w-4 h-4" />
                        </Button>
                        <Button size="sm" onClick={() => onFlag?.(spot.id)}>
                           <Flag className="w-4 h-4" />
                        </Button>
                     </>
                  )}
               </div>
            )}
         </CardContent>
      </Card>
   );
}
