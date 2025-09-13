export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gray-100 text-black w-fit">
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]" />
    </div>
  );
}
