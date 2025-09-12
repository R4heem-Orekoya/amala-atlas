"use client";
import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import {
  ImageIcon,
  FileUp,
  ArrowUpIcon,
  Paperclip,
  PlusIcon,
} from "lucide-react";

type AIChatProps = {
  //eslint-disable-next-line
  onExtract?: (data: any) => void;
};

export function AIChat({ onExtract }: AIChatProps) {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const submitMessage = async () => {
    const text = value.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setValue("");

    try {
      const res = await fetch("/api/parse-spot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const json = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Parsed fields — ${JSON.stringify(json.summary || json)}`,
        },
      ]);

      if (onExtract && json.parsed) {
        onExtract(json.parsed);
      }
      //eslint-disable-next-line
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "❌ Failed to parse message." },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hasHistory = messages.length > 0;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 space-y-6">
      {!hasHistory ? (
        <>
          <h1 className="text-2xl font-semibold">
            Tell me about the spot — I&apos;ll fill the form
          </h1>

          <div className="w-full">
            <div className="relative max-w-[700px] mx-auto rounded-xl border border-black/20 shadow">
              <Textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Eg: Mama T’s Amala Joint, 12 Ojukwu St, Ibadan, Amala-focused, rating 4.8"
                className={cn(
                  "w-full px-4 py-3 resize-none border-none bg-transparent text-sm focus:outline-none focus-visible:ring-0"
                )}
                style={{ minHeight: 60, overflow: "hidden" }}
              />
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <Button type="button">
                    <Paperclip className="w-4 h-4 text-white" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    className="border-dashed border-black/40"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Project
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={submitMessage}
                    disabled={!value.trim()}
                    className={cn(
                      "px-2 py-2 rounded-lg border border-black/30 flex items-center justify-center disabled:cursor-not-allowed",
                      value.trim() ? "bg-white text-black" : "text-zinc-400"
                    )}
                  >
                    <ArrowUpIcon
                      className={cn(
                        "w-4 h-4",
                        value.trim() ? "text-black" : "text-zinc-400"
                      )}
                    />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-4">
              <ActionButton
                icon={<ImageIcon className="w-4 h-4" />}
                label="Example: Quick parse"
                onClick={() => {
                  setValue(
                    "Mama T's Amala Joint, 12 Ojukwu St, Ibadan, Amala-focused, lat 7.3775 lng 3.9470, tags: traditional, affordable, rating 4.8"
                  );
                }}
              />
              <ActionButton
                icon={<FileUp className="w-4 h-4" />}
                label="Example: Address only"
                onClick={() => {
                  setValue("Ajike's, 4 Broad St, Lagos Island");
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                onClick={submitMessage}
                disabled={!value.trim()}
                className="rounded-full"
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

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="outline"
      type="button"
      className="rounded-full"
      onClick={onClick}
    >
      {icon}
      <span className="text-xs ml-2">{label}</span>
    </Button>
  );
}
