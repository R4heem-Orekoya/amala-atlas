import { Button } from "@/components/ui/button";
import { SiGithub } from "react-icons/si";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";
import { Bot, Plus } from "lucide-react";
import SpotCard from "@/components/spot-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { aiSuggestedSpots, amalaSpots } from "@/data";

export default function Home() {
   return (
      <main className="min-h-screen flex flex-col">
         <section className="py-24 bg-gradient-to-b from-orange-50 to-white px-4">
            <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
               <h1 className="text-4xl sm:text-4xl md:text-6xl text-balance tracking-tight font-bold mb-4">
                  Finding authentic Amala shouldn’t be luck.
               </h1>
               <p className="text-lg md:text-xl text-muted-foreground text-balance tracking-tight mb-8">
                  Find the best traditional Amala joints in Lagos, verified by
                  the community. From roadside gems to upscale kitchens -
                  discover your next favorite spot.
               </p>
               <div className="flex gap-4">
                  <Button asChild size="lg">
                     <Link href="/find-spot">
                        Find Amala Near You <CiSearch strokeWidth={1.5} />
                     </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                     <Link href="/add-new">
                        Add a Spot <Plus />
                     </Link>
                  </Button>
               </div>
            </div>
         </section>

         <section className="py-24 px-6 max-w-6xl mx-auto">
            <div className="text-center mb-12">
               <h2 className="text-4xl tracking-tight font-bold text-foreground mb-4">
                  Featured Amala Spots
               </h2>
               <p className="text-lg text-muted-foreground">
                  Discover the community's top-rated authentic Amala locations
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
               {amalaSpots
                  .filter((spot) => spot.verified && spot.rating >= 4.5)
                  .slice(0, 6)
                  .map((spot) => (
                     <SpotCard
                        key={spot.id}
                        spot={spot}
                        onViewDetails={() => {}}
                        showActions={false}
                     />
                  ))}
            </div>

            <Card className="shadow-card">
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Bot className="w-5 h-5 text-primary" />
                     AI-Suggested Spots
                     <Badge
                        variant="outline"
                        className="bg-amber-500/30 text-warning border-amber-500/80"
                     >
                        Community Review Needed
                     </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                     Our AI found these potential Amala spots. Help us verify
                     them!
                  </p>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     {aiSuggestedSpots.map((suggestion) => (
                        <div
                           key={suggestion.id}
                           className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50"
                        >
                           <div className="flex-1">
                              <h4 className="font-medium text-foreground">
                                 {suggestion.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                 {suggestion.address}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                 Found via: {suggestion.source} • Confidence:{" "}
                                 {Math.round(suggestion.confidence * 100)}%
                              </p>
                           </div>
                           <div className="flex gap-2">
                              <Button
                                 size="sm"
                              >
                                 Confirm
                              </Button>
                              <Button size="sm" variant="destructive" className="">
                                 Reject
                              </Button>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </section>

         <section className="py-16 px-6 bg-secondary text-center">
            <div className="max-w-3xl mx-auto">
               <h2 className="text-3xl sm:text-4xl text-balance tracking-tight font-bold mb-4 text-gray-900">
                  Built at Amala Hackathon – DevFest Lagos 2025
               </h2>
               <p className="text-muted-foreground text-balance mb-6 max-w-md mx-auto">
                  100% open source so future generations never struggle to find
                  the good bowl.
               </p>
               <Button asChild>
                  <Link
                     href="https://github.com/R4heem-Orekoya/amala-atlas"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     Contribute on GitHub <SiGithub />
                  </Link>
               </Button>
            </div>
         </section>

         <footer className="py-6 text-center text-muted-foreground text-sm">
            Made with ❤️ by Team Amala Atlas
         </footer>
      </main>
   );
}
