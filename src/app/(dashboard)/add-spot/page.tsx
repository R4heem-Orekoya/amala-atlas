"use client";
import { useState } from "react";
import {
  AddSpotForm,
  type SpotFormValues,
} from "@/components/custom-ui/AddSpotForm";
import SideContent from "@/components/custom-ui/SideContent";
import { AIChat } from "@/components/ui/AiChat";

export default function Page() {
  const [prefill, setPrefill] = useState<Partial<SpotFormValues> | null>(null);

  return (
    <main className="relative grid grid-cols-1 lg:grid-cols-9 gap-4 p-6 lg:max-h-screen overflow-y-hidden">
      <div className="col-span-1 lg:col-span-3">
        <SideContent>
          <AddSpotForm prefill={prefill ?? undefined} />
        </SideContent>
      </div>

      <div className="col-span-6">
        <div className="sticky top-6 h-[calc(100vh-48px)] border border-black/20 rounded-lg overflow-hidden flex justify-center items-center">
          <AIChat
            onExtract={(parsed) => {
               const prepared = {
                 ...parsed,
                 tags: Array.isArray(parsed.tags)
                   ? parsed.tags.join(", ")
                   : parsed.tags,
                 images: undefined,
               };
               setPrefill(prepared);
            }}
          />
        </div>
      </div>
    </main>
  );
}
