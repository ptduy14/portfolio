import { useState } from "react";

export default function ChatInput({ handleSubmitMessage, isDisabled }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isDisabled) return;

    handleSubmitMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <button
        type="submit"
        disabled={isDisabled || !input.trim()}
        className="bg-[#0041d6] hover:bg-[#003bc4] disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-all duration-200 flex-shrink-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me something..."
        disabled={isDisabled}
        className="flex-1 bg-[#121622] text-text-color p-3 border-solid border-transparent border-2 outline-none text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:border-[#0041d6] transition-all"
      />
    </form>
  );
}
