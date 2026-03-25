"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, Send } from "lucide-react";
import type { ChatMessage } from "@/features/ai-chat/model/chat";

interface AiChatModalProps {
  open: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
}

function TypingIndicator() {
  return (
    <div className="ai-chat-message-appear flex items-end gap-2">
      <div className="size-8 flex-shrink-0 overflow-hidden rounded-full border border-neutral-800 bg-[#2a2a2a]">
        <Image src="/image/jijii.png" alt="じじい" width={32} height={32} className="size-full object-cover" />
      </div>
      <div
        className="flex items-center gap-1 rounded-[16px_16px_16px_4px] px-4 py-3"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <span className="ai-chat-typing-dot size-2 rounded-full bg-neutral-400" style={{ animationDelay: "0ms" }} />
        <span className="ai-chat-typing-dot size-2 rounded-full bg-neutral-400" style={{ animationDelay: "150ms" }} />
        <span className="ai-chat-typing-dot size-2 rounded-full bg-neutral-400" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isAssistant = message.role === "assistant";

  if (isAssistant) {
    return (
      <div className="ai-chat-message-appear flex items-end gap-2">
        <div className="size-8 flex-shrink-0 overflow-hidden rounded-full border border-neutral-800 bg-[#2a2a2a]">
          <Image src="/image/jijii.png" alt="じじい" width={32} height={32} className="size-full object-cover" />
        </div>
        <div
          className="max-w-[75%] whitespace-pre-wrap px-4 py-3 text-[14px] leading-relaxed"
          style={{
            backgroundColor: "#FFFFFF",
            color: "#000000",
            borderRadius: "16px 16px 16px 4px",
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="ai-chat-message-appear flex justify-end">
      <div
        className="max-w-[75%] whitespace-pre-wrap px-4 py-3 text-[14px] leading-relaxed"
        style={{
          backgroundColor: "#000000",
          color: "#FFFFFF",
          borderRadius: "16px 16px 4px 16px",
          border: "1px solid #2a2a2a",
        }}
      >
        {message.content}
      </div>
    </div>
  );
}

export function AiChatModal({
  open,
  onClose,
  messages,
  isLoading,
  onSendMessage,
}: AiChatModalProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [open]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[90] transition-opacity duration-300"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-x-0 bottom-0 z-[100] mx-auto flex max-w-md flex-col"
        style={{
          height: "70%",
          backgroundColor: "#111111",
          borderRadius: "24px 24px 0 0",
          borderTop: "1px solid #2a2a2a",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid #2a2a2a" }}
        >
          <div className="flex items-center gap-2">
            <div className="size-8 overflow-hidden rounded-full border border-neutral-800 bg-[#2a2a2a]">
              <Image src="/image/jijii.png" alt="じじい" width={32} height={32} className="size-full object-cover" />
            </div>
            <span className="text-sm font-semibold text-white">じじい</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderTop: "1px solid #2a2a2a" }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="気になることを聞いてみよう"
            className="flex-1 rounded-full border-0 bg-[#2a2a2a] px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:ring-1 focus:ring-neutral-500"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-black transition-opacity disabled:opacity-30"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </>
  );
}
