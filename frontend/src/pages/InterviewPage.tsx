import { useRef, useState } from "react";
import Composer from "../components/chat/Composer";
import MessageList from "../components/chat/MessageList";
import type { ChatMessage } from "../types";

// TODO: candidate name and job position will come from the application flow.
const CANDIDATE_LABEL = "Candidate";

export default function InterviewPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      role: "interviewer",
      text: "Hello. Welcome to the interview. Ask or answer when you're ready.",
    },
  ]);
  const nextId = useRef(1);

  function handleSend(text: string) {
    const userMessage: ChatMessage = { id: nextId.current++, role: "user", text };
    const reply: ChatMessage = {
      id: nextId.current++,
      role: "interviewer",
      text: "Thanks. The interview agent will connect here later.",
    };
    setMessages((prev) => [...prev, userMessage, reply]);
  }

  return (
    <div className="page page--chat">
      <header className="chat-header">
        <h1>Interview</h1>
        <p>{CANDIDATE_LABEL}</p>
      </header>
      <MessageList messages={messages} userLabel={CANDIDATE_LABEL} />
      <Composer onSend={handleSend} />
    </div>
  );
}
