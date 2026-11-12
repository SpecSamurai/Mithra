import type { ChatMessage } from "../../types";

type MessageBubbleProps = {
  message: ChatMessage;
  userLabel: string;
};

export default function MessageBubble({ message, userLabel }: MessageBubbleProps) {
  return (
    <div className={`bubble bubble--${message.role}`}>
      <span className="bubble__label">
        {message.role === "user" ? userLabel : "Interviewer"}
      </span>
      <p>{message.text}</p>
    </div>
  );
}
