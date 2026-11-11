import { useEffect, useRef, useState, type FormEvent } from "react";

type Role = "user" | "interviewer";

type Message = {
  id: number;
  role: Role;
  text: string;
};

type ChatProps = {
  name: string;
};

export default function Chat({ name }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "interviewer",
      text: `Hello, ${name}. Welcome to the interview. Ask or answer when you're ready.`,
    },
  ]);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const userMessage: Message = {
      id: nextId.current++,
      role: "user",
      text,
    };
    const reply: Message = {
      id: nextId.current++,
      role: "interviewer",
      text: `Thanks, ${name}. The interview agent will connect here later.`,
    };

    setMessages((prev) => [...prev, userMessage, reply]);
    setDraft("");
  }

  return (
    <div className="page page--chat">
      <header className="chat-header">
        <h1>Interviewer</h1>
        <p>{name}</p>
      </header>

      <div className="chat-messages" ref={listRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`bubble bubble--${message.role}`}
          >
            <span className="bubble__label">
              {message.role === "user" ? name : "Interviewer"}
            </span>
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <form className="chat-composer" onSubmit={handleSubmit}>
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type a message…"
          autoFocus
        />
        <button type="submit" disabled={!draft.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
