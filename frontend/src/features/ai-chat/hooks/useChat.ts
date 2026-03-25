"use client";

import { useCallback, useRef, useState } from "react";
import type { ChatMessage } from "@/features/ai-chat/model/chat";
import { buildSystemPrompt } from "@/features/ai-chat/model/chat";
import type { NewsEntity } from "@/entities/news/model/types";

const INITIAL_MESSAGE: ChatMessage = {
  id: "initial",
  role: "assistant",
  content: "何か質問あるかい？？😎",
};

export function useChat(article: NewsEntity) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (userContent: string) => {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: userContent,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        abortControllerRef.current = new AbortController();

        const apiMessages = [...messages, userMessage]
          .filter((m) => m.id !== "initial")
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            systemPrompt: buildSystemPrompt(article),
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.message,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "ゴメンネ〜💦 ちょっと調子が悪いみたいﾀﾞﾖ😅 もう一回聞いてくれるｶﾅ？",
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, article]
  );

  const resetChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([INITIAL_MESSAGE]);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, sendMessage, resetChat };
}
