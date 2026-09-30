"use client";

import type { ReactNode } from "react";
import { SpeakButton } from "@/components/chat-voice";

function renderContent(content: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(content)) !== null) {
    if (m.index > last) {
      parts.push(
        <span key={key++} className="whitespace-pre-wrap">
          {content.slice(last, m.index)}
        </span>
      );
    }
    parts.push(
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={key++}
        src={m[2]}
        alt={m[1] || "Figura TIA Nutri"}
        className="my-2 max-h-80 w-full rounded-xl border border-[var(--line)] object-contain bg-white"
      />
    );
    last = m.index + m[0].length;
  }
  if (last < content.length) {
    parts.push(
      <span key={key++} className="whitespace-pre-wrap">
        {content.slice(last)}
      </span>
    );
  }
  return parts.length
    ? parts
    : [
        <span key="all" className="whitespace-pre-wrap">
          {content}
        </span>,
      ];
}

export function ChatMessageBubble({
  role,
  content,
}: {
  role: string;
  content: string;
}) {
  const isUser = role === "user";
  return (
    <div
      className={`max-w-[95%] space-y-1 rounded-2xl px-3 py-2 text-sm ${
        isUser ? "ml-auto bg-[var(--brand)] text-white" : "bg-[var(--brand-soft)] text-[var(--ink)]"
      }`}
    >
      <div>{renderContent(content)}</div>
      {!isUser ? <SpeakButton text={content} /> : null}
    </div>
  );
}
