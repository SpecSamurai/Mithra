import { useEffect, useRef } from "react";
import type { ChatMessage } from "../../types";
import MessageBubble from "./MessageBubble";

type MessageListProps = {
  messages: ChatMessage[];
  userLabel: string;
  autoScroll?: boolean;
};

export default function MessageList({
  messages,
  userLabel,
  autoScroll = true,
}: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoScroll) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, autoScroll]);

  return (
    <div className="chat-messages" ref={listRef}>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} userLabel={userLabel} />
      ))}
    </div>
  );
}
