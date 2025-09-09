"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail, MapPin, MessageSquare, Twitter } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";

export function ShareSpotModal({
  spot,
  children,
}: {
  //eslint-disable-next-line
  spot?: any;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://eventnest.app/spots/${spot?.id ?? "123"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <div className="h-40 w-full bg-muted overflow-hidden">
          {spot?.imageUrl ? (
            <div className="w-full h-full">
              <Image
                src={spot.imageUrl}
                alt={spot.name}
                fill
                className=" object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <MapPin className="w-10 h-10 opacity-40" />
            </div>
          )}
        </div>
        <div className="p-4">
          <DialogTitle className="text-lg font-semibold">
            Share this spot
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Invite friends to check out{" "}
            <span className="font-medium">{spot?.name ?? "Amala Spot"}</span>
            {spot?.address && (
              <span className="block text-xs text-muted-foreground mt-0.5">
                {spot.address}
              </span>
            )}
          </p>
        </div>
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 border rounded-md p-2">
            <Input
              value={shareUrl}
              readOnly
              className="border-0 shadow-none"
            />
            <Button
              size="sm"
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 p-4 border-t">
          <Button
            variant="outline"
            className="flex flex-col gap-1 py-8"
          >
            <Twitter className="w-5 h-5" />
            <span className="text-xs">Twitter</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col gap-1 py-8"
          >
            <Mail className="w-5 h-5" />
            <span className="text-xs">Email</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col gap-1 py-8"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">WhatsApp</span>
          </Button>
        </div>
        <div className="p-4 border-t text-center text-sm text-muted-foreground">
          Already shared <span className="font-medium">23 times</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
