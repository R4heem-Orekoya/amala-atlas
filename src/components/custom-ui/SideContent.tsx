"use client";

import { ArrowRightIcon, MapPinned, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SpotsTabs from "./SpotsTab";
import useLocation from "@/hooks/use-location";
import { Doc } from "../../../convex/_generated/dataModel";

type SidebarProps = {
  children: React.ReactNode
};

export default function SideContent({ children }: SidebarProps) {

  return (
    <div className="sticky top-6 flex flex-col max-h-[calc(100vh-48px)]">
      {children}
    </div>
  );
}
