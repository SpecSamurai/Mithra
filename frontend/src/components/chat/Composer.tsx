import { useState, type FormEvent } from "react";

type ComposerProps = {
  onSend: (text: string) => void;
};

export default function Composer({ onSend }: ComposerProps) {
  const [draft, setDraft] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  }

  return (
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
  );
}
