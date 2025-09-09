"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Place } from "@/types";
import {
  Bookmark,
  Flag,
  MapPin,
  MessageSquare,
  Send,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import { ShareSpotModal } from "./ShareSpotModal";
import Image from "next/image";

type SpotDetailsTriggerProps = {
  children: React.ReactNode;
  spot?: Place;
};

export function SpotDetailsTrigger({
  children,
  spot,
}: SpotDetailsTriggerProps) {
  const [upvotes, setUpvotes] = useState(12);
  const [downvotes, setDownvotes] = useState(3);

  const comments = spot?.comments ?? [];

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md h-[100dvh] p-0 flex flex-col"
      >
        <SheetHeader className="p-4 border-b">
          <div className="h-40 w-full rounded-md overflow-hidden bg-muted relative mt-7">
            {spot?.imageUrl ? (
              <div className="w-full h-full ">
                <Image
                  src={spot.imageUrl}
                  alt={spot.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <MapPin className="w-12 h-12 opacity-40" />
              </div>
            )}
          </div>
          <div className="mt-3">
            <SheetTitle className="text-xl font-semibold">
              {spot?.name ?? "Amala Spot"}
            </SheetTitle>
            <p className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <MapPin className="w-4 h-4 shrink-0" />
              {spot?.location.formatted_address ?? "Unknown address"}
            </p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setUpvotes(upvotes + 1)}
                className="flex items-center gap-1"
              >
                <ThumbsUp className="w-4 h-4" /> {upvotes}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDownvotes(downvotes + 1)}
                className="flex items-center gap-1"
              >
                <ThumbsDown className="w-4 h-4" /> {downvotes}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
              >
                <Bookmark className="w-4 h-4" />
              </Button>
              <ShareSpotModal spot={spot}>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </ShareSpotModal>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50"
              >
                <Flag className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1 p-4 ">
          {comments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground mt-20 relative min-h-full">
              <MessageSquare className="w-12 h-12 mb-2 opacity-40" />
              <p className="text-sm">No comments yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className={`flex items-start gap-2 ${
                    c.author === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg max-w-[80%] text-sm ${
                      c.author === "me"
                        ? "bg-muted"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <p>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-3 border-t flex gap-2 items-center">
          <Input
            placeholder="Write a comment..."
            className="flex-1"
          />
          <Button>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
