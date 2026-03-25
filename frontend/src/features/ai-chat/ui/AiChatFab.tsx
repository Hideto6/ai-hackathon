"use client";

import Image from "next/image";

interface AiChatFabProps {
  onClick: () => void;
}

export function AiChatFab({ onClick }: AiChatFabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute bottom-5 right-4 z-[80] flex size-14 items-center justify-center overflow-hidden rounded-full bg-transparent transition-transform hover:scale-105 active:scale-95"
      style={{
        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.25))",
      }}
    >
      <Image
        src="/ai_icon.png"
        alt="AIに質問する"
        width={56}
        height={56}
        className="size-full object-cover"
      />
    </button>
  );
}
