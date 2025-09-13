// components/ui/AiChat.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { ImageIcon, FileUp, ArrowUpIcon } from "lucide-react";

type AIChatProps = {
  onExtract?: (data: any) => void;
};

export function AIChat({ onExtract }: AIChatProps) {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const msgText = (text ?? value).trim();
    if (!msgText) return;
    setIsLoading(true);
    const userMsg = { role: "user" as const, text: msgText };
    setMessages((m) => [...m, userMsg]);
    setValue("");

    try {
      const res = await fetch("/api/agent/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: msgText,
          conversation: messages, // optional history to help context
        }),
      });

      const json = await res.json();

      if (json?.needsClarification) {
        // assistant asks clarification — show question and WAIT for user to reply
        const assistantText =
          json.message || json.parsed?.clarifyingQuestion || "Can you clarify?";
        setMessages((m) => [...m, { role: "assistant", text: assistantText }]);
        // do NOT call onExtract
      } else {
        // parsed output ready — show short assistant summary and call onExtract
        const assistantText =
          json.message || "I parsed the spot. Prefilling the form.";
        setMessages((m) => [...m, { role: "assistant", text: assistantText }]);
        if (onExtract && json.parsed) {
          onExtract(json.parsed);
        }
        // If coordinates were suggested, include that as a follow-up message for the user
        if (json.suggestedCoordinates) {
          setMessages((m) => [
            ...m,
            {
              role: "assistant",
              text: `Suggested coordinates: ${json.suggestedCoordinates.latitude.toFixed(
                5
              )}, ${json.suggestedCoordinates.longitude.toFixed(
                5
              )} (from geocoding)`,
            },
          ]);
        }
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Failed to parse message (network error)." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hasHistory = messages.length > 0;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 space-y-6">
      {!hasHistory ? (
        <>
          <h1 className="text-4xl font-semibold text-black dark:text-white">
            Describe your Amala spot
          </h1>
          <p className="text-neutral-600 text-center max-w-lg">
            Tell me the details (name, address, category, rating, tags...) and
            I’ll help fill the form automatically.
          </p>

          <div className="w-full">
            <div className="relative max-w-[700px] mx-auto rounded-xl border border-black/20 shadow">
              <Textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Eg: Mama T’s Amala Joint, 12 Ojukwu St, Ibadan, Amala-focused, rating 4.8"
                className={cn(
                  "w-full px-4 py-3 resize-none border-none bg-transparent text-sm"
                )}
                style={{ minHeight: 60 }}
              />
              <div className="flex items-center justify-between p-3">
                <div />
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => sendMessage()}
                    disabled={!value.trim() || isLoading}
                    className={cn(
                      "px-2 py-2 rounded-lg border border-black/30",
                      value.trim() ? "bg-white text-black" : "text-zinc-400"
                    )}
                  >
                    <ArrowUpIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() =>
                  setValue(
                    "Mama T's Amala Joint, 12 Ojukwu St, Ibadan, Amala-focused, rating 4.8"
                  )
                }
              >
                <ImageIcon className="w-4 h-4 mr-2" /> Example: Quick parse
              </Button>
              <Button
                variant="outline"
                onClick={() => setValue("Ajike's, 4 Broad St, Lagos Island")}
              >
                <FileUp className="w-4 h-4 mr-2" /> Example: Address only
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col justify-end">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "px-4 py-2 rounded-xl w-fit max-w-[80%] text-sm",
                  m.role === "user"
                    ? "bg-black text-white self-end ml-auto"
                    : "bg-gray-100 text-black self-start"
                )}
              >
                {m.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="border-t p-3 bg-white">
            <div className="flex items-end gap-2">
              <Textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your next message..."
                className="flex-1 resize-none border rounded-xl px-3 py-2 text-sm"
                style={{ minHeight: 50, maxHeight: 120 }}
              />
              <Button
                size="icon"
                variant="default"
                onClick={() => sendMessage()}
                disabled={!value.trim()}
              >
                <ArrowUpIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIChat;
