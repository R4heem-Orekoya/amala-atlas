"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SpotCard from "./SpotCard";
import { Spots } from "@/types";
import { Doc } from "../../../convex/_generated/dataModel";

type SpotsTabsProps = {
  data?: Doc<"spots">[];
  isLoading: boolean;
};

export default function SpotsTabs({ data, isLoading }: SpotsTabsProps) {
  return (
    <Tabs
      defaultValue="verified"
      className="flex-1 flex flex-col mt-4 min-h-full"
    >
      <TabsList className="bg-transparent my-2 w-full justify-between">
        <TabsTrigger value="verified">Verified Spots</TabsTrigger>
        <TabsTrigger value="user">User&apos;s Spots</TabsTrigger>
        <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
      </TabsList>
      <ScrollArea className="overflow-y-auto flex-1 flex flex-col">
        <TabsContent
          value="verified"
          className="flex flex-col flex-1"
        >
          {isLoading && <p>Loading spots...</p>}
          {data?.map((spot) => (
            <SpotCard
              key={spot._id}
              spot={spot}
            />
          ))}
        </TabsContent>

        <TabsContent
          value="user"
          className="flex flex-col flex-1"
        >
          <div className="p-4 mt-4 border rounded-lg">
            User Spot Placeholder
          </div>
        </TabsContent>

        <TabsContent
          value="ai"
          className="flex flex-col flex-1"
        >
          <div className="p-4 mt-4 border rounded-lg">
            AI Suggestion Placeholder
          </div>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}
